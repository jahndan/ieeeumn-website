//! this file defines utility functions for the tech committee projects virtual
//! file tree. these functions implement logic for statically specifying the
//! dynamic routes and providing the .astro files any relevant data they need
//! to construct the desired file tree html markup

import { getCollection } from "astro:content";

export async function get_collection () {
  const contents_raw = await getCollection("projects");
  const contents = contents_raw.map(
    it => it.id === "index" ? { ...it, id: "" } : it
  );
  const paths = contents.map((f) => f.id);
  return { contents, paths }
}

export function splitter(path: string) {
  const idx = path.lastIndexOf("/")
  if (idx == -1) return { slug: "", res: path };
  return {
    slug: path.slice(0, idx),
    res: path.slice(idx + 1),
  }
}

type base = {
  name: string,
  path: string,
};
export type ft_entry = base & {
  type: "file" | "directory",
  children: ft_entry[], // only valid when .type == "directory"
};
export type route = base & {
  children: base[]
};

/// splits out the input paths to construct every directory entry along the
/// way. every input is assumed a file until proven otherwise by appearing as a
/// prefix in another file path
export function build_ft(files: string[]): ft_entry {
  const root: ft_entry = { name: "/", type: "directory", path: "/", children: [] };

  for (const file of files) {
    const parts = file.split("/").filter(Boolean);
    let node = root; // reference to object
    let current_path = "";

    parts.forEach((part, i) => {
      current_path += "/" + part;
      const is_file = (i === parts.length - 1);

      let child = node.children?.find(c => c.name === part);
      if (!child) {
        child = { name: part, type: is_file ? "file" : "directory", path: current_path, children: [] };
        node.children.push(child);
      } else if (!is_file && child.type === "file") {
        child.type = "directory"; // previously encountered "file" is a prefix
      }

      if (!is_file) node = child;
    });
  }

  return root;
}

function remove_leading_slash_from_path(input: base) {
  return {
    ...input,
    path: input.path.replace(/^\//g, "")
  }
}

export function directories(node: ft_entry, result: route[] = []) {
  if (node.type === "directory") {
    result.push({
      name: node.name,
      path: node.path,
      children: node.children.map(it => ({
        name: it.name + (it.type == "file" ? ".md" : "/"),
        path: it.path,
      }))
    });
    for (const child of node.children) {
      directories(child, result);
    }
  }
  return result.map(remove_leading_slash_from_path);
}

export function files(node: ft_entry): base[] {
  if (node.type === "file") return [node];
  return node.children.flatMap(files).map(remove_leading_slash_from_path);
}

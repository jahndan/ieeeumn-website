+++
title = "USB Controller Mini-tutorials"
+++

<!-- reorganize this stuff, probably move CMake into its own "troubleshooting" page -->

## CMake

**Open CMakeLists.txt for your Pico target.**

You’ll start with something like:

```cmake
add_executable(<target_name>
    main.c
)
```

This defines one build target and tells CMake which source files belong to it.

**Add your modules (example)**

Instead of a single main.c, explicitly list every module you want built:

```cmake
add_executable(<target_name>
    main.c
    <path/to/module1.c>
    <path/to/module2.c>
)
```

This ensures CMake actually compiles your drivers (it will not auto-discover files).

**Libraries**

Link Pico SDK libraries your code relies on:

```cmake
target_link_libraries(<target_name>
    pico_stdlib
    <pico_library_1>
    <pico_library_2>
)
```

**Common examples:**

- `pico_stdlib`: GPIO, timing, basic SDK features
- `hardware_adc`: analog reads (ADC)
- `hardware_i2c`: I2C peripherals
- `hardware_spi`: SPI peripherals
- `hardware_pwm`: PWM output
- `tinyusb_device`: USB device stack (when you get to HID/CDC)

**USB vs UART stdio**

```cmake
pico_enable_stdio_usb(<target_name> 1)
pico_enable_stdio_uart(<target_name> 0)
```

USB = 1 → enable USB CDC (/dev/ttyACM\*, COM port)
UART = 1 → enable UART serial output (optional)

You can enable either, both, or neither.

**Test targets follow the same pattern**

Add another executable that reuses production modules:

```cmake
add_executable(<test_target>
    <path/to/test_main.c>
    <path/to/module_under_test.c>
)

target_include_directories(<test_target> PRIVATE
    ${CMAKE_CURRENT_LIST_DIR}
    ${CMAKE_CURRENT_LIST_DIR}/<include_folder>
)

target_link_libraries(<test_target>
    pico_stdlib
    <pico_library_needed>
)
```

Result: multiple `.uf2` files, each flashable independently.

## `main.cpp` setup

“Hello World”

- Initializes the Pico runtime
- Enables USB serial output
- Prints a message forever

The entire idea in one view:

```c
#include "pico/stdlib.h"

int main() {
    stdio_init_all();          // enable USB serial
    while (true) {
        printf("Hello Pico\n");
        sleep_ms(1000);
    }
}
```

What each line means:

- `#include "pico/stdlib.h"`: gives you GPIO, timing, USB-stdio
- `stdio_init_all()`: allows printf over USB
- `while (true)`: microcontrollers don’t exit
- `sleep_ms(1000)`: timing is explicit (no OS scheduler)

### GPIO basics

**What a GPIO pin is**

- A GPIO is a digital pin you control in software
- Two modes:
  - Output → you drive HIGH / LOW
  - Input → you read HIGH / LOW

**Digital logic levels**

- HIGH ≈ 3.3 V - not 5 V tolerant
- LOW ≈ 0 V

**Why pull-ups exist**

- Inputs cannot be left “floating”
- A pull-up weakly holds the pin HIGH when nothing is connected
- Pressing a button can then pull it LOW

**Wiring**

GPIO----Button----GND

GPIO setup

```c
int pin = 14;
gpio_init(pin);
gpio_set_dir(pin, GPIO_IN);
gpio_pull_up(pin);    // or pull_down
```

Reading the pin

```c
bool level = gpio_get(pin);   // true = 1, false = 0
```

## Reading a button (Polling)

**Goal**

- Sample the pin repeatedly (polling)
- Compare current state to last state
- Act only when it changes

**Minimal example**

```c
const uint BUTTON = 16;

int main() {
    stdio_init_all();

    gpio_init(BUTTON);
    gpio_set_dir(BUTTON, GPIO_IN);
    gpio_pull_up(BUTTON);

    bool last = gpio_get(BUTTON);

    while (true) {
        bool now = gpio_get(BUTTON);

        if (now != last) {
            printf(now ? "RELEASED\n" : "PRESSED\n");
            last = now;
        }

        sleep_ms(10);
    }
}
```

We should see one message per press/release

### Debouncing

**Debounce Solution**
Accept a change only if it stays stable for X ms.

**Example with Debounce**

```c
const uint BUTTON = 14;
const uint DEBOUNCE_MS = 25;

bool stable_state;
bool last_read;
absolute_time_t last_change;

int main() {
    stdio_init_all();

    gpio_init(BUTTON);
    gpio_set_dir(BUTTON, GPIO_IN);
    gpio_pull_up(BUTTON);

    stable_state = last_read = gpio_get(BUTTON);
    last_change = get_absolute_time();

    while (true) {
        bool now = gpio_get(BUTTON);

        if (now != last_read) {
            last_read = now;
            last_change = get_absolute_time();
        }

        if (absolute_time_diff_us(last_change, get_absolute_time()) > DEBOUNCE_MS * 1000) {
            if (stable_state != last_read) {
                stable_state = last_read;
                printf(stable_state ? "RELEASED\n" : "PRESSED\n");
            }
        }

        sleep_ms(1);
    }
}
```

## Interrupts

**What changes vs polling**

- Polling: you ask the pin repeatedly
- Interrupt: the hardware tells you when the pin changes (edge)

Use interrupts when you want low-latency or don’t want to spin in a loop.

Note

- ISR must be fast
- Don’t printf in the ISR (it can be slow / unsafe)
- In ISR: set a flag + record time (For button)
- In while(true): consume the flag and do the real work

**Example with Interrupt**

```c
#include "pico/stdlib.h"
#include "hardware/gpio.h"

const uint BUTTON = 14;
volatile bool button_event = false;
volatile absolute_time_t event_time;

void on_gpio(uint gpio, uint32_t events) {
    if (gpio == BUTTON && (events & GPIO_IRQ_EDGE_FALL)) {
        event_time = get_absolute_time();
        button_event = true;
    }
}

int main() {
    stdio_init_all();

    gpio_init(BUTTON);
    gpio_set_dir(BUTTON, GPIO_IN);
    gpio_pull_up(BUTTON);

    gpio_set_irq_enabled_with_callback(BUTTON, GPIO_IRQ_EDGE_FALL, true, &on_gpio);

    while (true) {
        if (button_event) {
            button_event = false;           // consume
            printf("PRESSED (irq)\n");
        }
        tight_loop_contents();              // “idle”
    }
}
```

## References

[Raspberry Pi Pico-series C/C++ SDK](https://pip-assets.raspberrypi.com/categories/609-microcontroller-boards/documents/RP-009085-KB-1-raspberry-pi-pico-c-sdk.pdf)

[Pico button](https://github.com/raspberrypi/pico-examples/blob/master/picoboard/button/button.c)

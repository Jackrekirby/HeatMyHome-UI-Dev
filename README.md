# heat_ninja_ui

https://jackrekirby.github.io/heat_ninja_ui/

### Folder Guide

Here is a summary of the contents of the main folders:

- `docs` contains all the files required for the HeatMyHome website (which is hosted through GitHub Pages)
- `native-cpp` contains the native C++ code for the heating simulator. This version is not as well maintained / written after the Rust implementation, although should produce the same outputs. You can choose to run this version client side on the website under experimental options.
- `native-rust` contains the native Rust code for the heating simulator. This version is run server side, and can also be run client side on the website under experimental options.

If you are wanting to use a version of the heating model but unsure about which version to decide on I have summarised a list of pros and cons of the C++ and Rust versions below.

---

### Advantages of C++ / Disadvantages of Rust

1. The C++ version is faster than Rust, especially for large property sizes.
2. The WASM version compiled from C++ is faster than that compiled from Rust, especially for large property sizes. (Although this is not a problem if you plan to run the code natively).
3. The C++ version is much easier to performance profile (I used Visual Studio, for Windows). This is partially because the code is highly functionised, making it easy to see the performance of small sections of code.

---

### Disadvantages of C++ / Advantages of Rust

1. If you are unfamiliar with Rust or C++, but you have used Python or other similar language, I would recommend Rust.
2. The C++ version is highly functionised, but this can make the code difficult to read as one must jump between functions, rather than being in chronological order.
3. If you wanting to use the WASM compiled version, you must use Emscripten, while the Rust

# HeatMyHome User Interface Development
This repository was used to develop the user interface for the [HeatMyHome.ninja](https://heatmyhome.ninja) website.

In summary, the website simulates a range of domestic heating systems alongside solar photovoltaic and solar thermal technologies to optimise the system configuration and estimate the operation costs, capital costs and operating emissions for each of the technologies simulated. It takes as input the user's location and home details to find the optimal heating system unique to the user's circumstances.


The GitHub repository for HeatMyHome can be found at [here](https://github.com/heatmyhome-ninja/HeatMyHome-Website). The repository used to develop the HeatMyHome simulator can be found [here](https://github.com/Jackrekirby/HeatMyHome-Simulator-Dev). The final simulation code along with API, and user interface can be found at the HeatMyHome repository. However this repository contains additional raw files, and one can go back through the commit history to view its progression. 

The webpage which is hosted from this repository  can be found [here](https://jackrekirby.github.io/HeatMyHome-UI-Dev/).

Here is a guide to the folder structure:

- `docs` contains all the files required for the HeatMyHome website (which is hosted through GitHub Pages)
- `native-cpp` contains the native C++ code for the heating simulator. This version is not as well maintained / written after the Rust implementation, although should produce the same outputs. You can choose to run this version client side on the website under experimental options.
- `native-rust` contains the native Rust code for the heating simulator. This version is run server side, and can also be run client side on the website under experimental options.

If you are wanting to use a version of the heating model but unsure about which version to decide on I have summarised a list of pros and cons of the C++ and Rust versions below.

Please contact me if you wish to use the simulator and need help navigating the repository.

**Advantages of C++ / Disadvantages of Rust**

1. The C++ version is faster than Rust, especially for large property sizes.
2. The WASM version compiled from C++ is faster than that compiled from Rust, especially for large property sizes. (Although this is not a problem if you plan to run the code natively).
3. The C++ version is much easier to performance profile (I used Visual Studio, for Windows). This is partially because the code is highly functionised, making it easy to see the performance of small sections of code.

**Disadvantages of C++ / Advantages of Rust**  

1. If you are unfamiliar with Rust or C++, but you have used Python or other similar language, I would recommend Rust.
2. The C++ version is highly functionised, but this can make the code difficult to read as one must jump between functions, rather than being in chronological order.
3. If you wanting to use the WASM compiled version, you must use Emscripten, while the Rust

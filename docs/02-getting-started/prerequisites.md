# 开发前置条件

## 硬件

- RA8P1 开发板及其匹配的调试下载器。推荐使用 [EK-RA8P1](https://www.renesas.cn/zh/design-resources/boards-kits/ek-ra8p1#documents)。

![EK-RA8P1 开发板](../assets/images/ek-ra8p1-overview.png)

EK-RA8P1 提供以下硬件资源：

- J-Link OB 板载调试器
- 7.0 英寸、1024 × 600 并行接口 LCD 板
- 500 万像素 OV5640 摄像头模块
- 以太网接口（RGMII）
- USB 高速主机和设备模式
- 64 MB 外部 Octo-SPI Flash
- 64 MB SDRAM
- PDM MEMS 麦克风
- 带扬声器输出连接的音频编解码器

## 软件

- e2 studio 2026-04及以上。
- FSP 6.5.1 及以上。
- 用于模型处理的 Python 环境及转换依赖。

详细版本请维护在[版本兼容表](../10-reference/version-matrix.md)。不要仅以“最新版”作为工程依赖约束。

## 部署前清单

- [ ] 已取得 MNIST 示例工程、`mnist_quant.tflite` 和 0 到 9 的参考输入。
- [ ] 已安装 Vela、e2 studio、FSP 和 SEGGER RTT Viewer。
- [ ] 已准备可连接 EK-RA8P1 的调试与烧录环境。
- [ ] 已了解 TFLite 模型、Vela 输出模型和 Tensor Arena 的用途不同。

本章的目标是先复现参考流程。Keras/ONNX 模型转换、量化原理、Representative Dataset 和精度比较将在第 3 章展开。

下一步：[运行第一个 AI 示例 - MNIST](quick-start.md)。

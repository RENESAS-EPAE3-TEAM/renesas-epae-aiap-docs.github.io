# Renesas RA8P1 AI Application Guide

RA8P1 端侧 AI 开发文档，涵盖 MNIST 快速入门、Keras/ONNX 模型转换与量化、Ethos-U55 NPU 部署、平台配置、自定义算子和性能验证。

## 当前版本

- 文档版本：v1.0.0
- 发布日期：2026-08-05
- 在线站点：[RA8P1 AI 应用开发指南](https://renesas-epae3-team.github.io/renesas-epae-aiap-docs.github.io/)

## 本地构建

```bash
python -m pip install -r requirements.txt
python -m mkdocs build --strict
```

源文档位于 `docs/`，导航和站点配置位于 `mkdocs.yml`。版本变更参见 `docs/10-reference/release-notes.md`。

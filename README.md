# Life Design Course (人生设计课)

基于《斯坦福人生设计课》核心概念设计的交互式 Web 页面原型。

## Docker 部署指南

### 1. 构建与发布 (开发端)

如果你修改了代码，需要重新构建镜像并发布到 Docker Hub。
**重要**：为了兼容 Linux 服务器 (AMD64 架构)，构建时必须指定 `--platform linux/amd64`。

```bash
# 1. 构建镜像 (跨平台构建)
docker build --platform linux/amd64 -t bainianshushu/life-design-course:latest .

# 2. 推送到仓库
docker push bainianshushu/life-design-course:latest
```

### 2. 服务器部署 (服务端)

在目标服务器上拉取镜像并运行。
**注意**：由于服务器 80 端口被占用，我们将容器映射到 **8789** 端口。

```bash
# 1. 拉取最新镜像
docker pull bainianshushu/life-design-course:latest

# 2. 停止并删除旧容器 (如果存在)
docker stop life-design-course-app || true
docker rm life-design-course-app || true

# 3. 启动新容器
# -d: 后台运行
# -p 8789:80: 将主机的 8789 端口映射到容器的 80 端口 (主机端口:容器端口)
# --name: 指定容器名称，方便管理
# --restart always: 容器退出或服务器重启后自动重启
docker run -d \
  --restart always \
  -p 8789:80 \
  --name life-design-course-app \
  bainianshushu/life-design-course:latest
```

### 3. 访问验证

部署完成后，通过浏览器访问：
`http://<服务器IP>:8789`

### 本地开发

```bash
npm install
npm run dev
```

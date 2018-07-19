# AutoBlender
This project provides an HTML front-end to a series of Python libraries for audio analysis. The system then converts that output into dynamic 3D animations in Blender.

## Contents
This project contains the full source for both the individual pyBlender project and the web/cloud enabled autoBlender project.

It uses:
  - Node.JS
    - Express 4 Web Server
    - Socket.io Async Updates
    - PM2 Process Management
  - NGINX
    - Reverse Proxy
    - SSL/TLS via Let's Encrypt
  - Python3
    - Audio Processing (librosa)
    - Numerical Analysis (numpy)
  - Blender
    - Mesh Creation
    - Color/Size Control
    - Runs on Python 3

## Architecture
![Architecture](Website/public/Architecture.png?raw=true)

## FAQ
1. Why?
  A. I wanted to extend an existing project (pyBlender) while also having a chance to use web sockets, child processes, and a reverse proxy.

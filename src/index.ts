#!/usr/bin/env node
import yargs from 'yargs'
import { createProxyMiddleware } from 'http-proxy-middleware'
import express from 'express'

yargs.command(
  '$0 <port> <target>',
  'Run CORS Proxy',
  (yargs) =>
    yargs
      .positional('port', {
        describe: 'Local listen port',
        type: 'number',
        demandOption: true
      })
      .positional('target', {
        describe: 'Target URL',
        type: 'string',
        demandOption: true
      }),
  (args) => {
    const app = express()
    app.use(
      createProxyMiddleware({
        target: args.target,
        changeOrigin: true,
        onProxyReq(proxyReq, req, res) {
          console.log(`[${req.method}] ${req.url}`)
        },
        onProxyRes(proxyRes, req, res) {
          proxyRes.headers['Access-Control-Allow-Origin'] = '*'
        }
      })
    )
    app.listen(args.port)
    console.log('Listening on port ' + args.port)
  }
).argv

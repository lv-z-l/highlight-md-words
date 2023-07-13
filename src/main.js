#!/usr/bin/env node
const { replaceMdFileWords } = require('./handle.js')
// 字体
const chalk = require('chalk')
// // 命令
const { Command } = require('commander')
// // 交互
// const inquirer = require('inquirer')

const { log } = console
const program = new Command()

let start = 0
let end = 0
program
  .name('highlight-md-words')
  .version('1.0.0', '-v, --version')
  .argument('<directory>')
  .description('Highlight the English words in the md document')
  .action(directory => {
    start = Date.now()
    log(chalk.red.bold(`====> Welcome to use highlight-md-words!`))
    log(chalk.green.bold('====> processing...'))
    replaceMdFileWords(directory)
      .then(() => {
        end = Date.now()
        log(
          chalk.green.bold(`====> handle success in ${(end - start) / 1000} s`)
        )
      })
      .catch(err => {
        log(chalk.red.bold('====> handle failed'))
        log(err)
      })
  })

program.parse()

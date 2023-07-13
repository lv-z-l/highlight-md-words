const MD_REGX = /\.md$/

const TEMP_N = '@@$$$$@@'
const TEMP_R = '@@%%%%@@'

const WORDS_PATTERN = /[a-zA-Z][a-zA-Z0-9_-]*/g

const fs = require('fs')

const path = require('path')

function getMdFiles(curpath, res = []) {
  const dirs = fs.readdirSync(path.resolve(curpath))
  dirs.forEach(dir => {
    const current = curpath + '/' + dir
    const fileStatus = fs.statSync(current)
    if (fileStatus.isDirectory()) {
      getMdFiles(current, res)
    } else {
      if (MD_REGX.test(dir)) {
        res.push(current)
      }
    }
  })
  return res
}

function replaceMdFileWords(dir) {
  return new Promise((res, rej) => {
    const mdFiles = getMdFiles(dir)
    const l = mdFiles.length
    let success = 0
    mdFiles.forEach(md => {
      fs.readFile(md, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
          rej(err)
          return console.err(err)
        }
        const lines = data
          .replaceAll('/n', TEMP_N)
          .replaceAll('/r', TEMP_R)
          .split('```')
        let length = lines.length
        for (let i = 0; i < length; i++) {
          if (i % 2 === 0) {
            lines[i] = lines[i].replace(
              WORDS_PATTERN,
              match => ` \`${match.trim()}\` `
            )
          }
        }
        const handleMdFiles = lines
          .join('```')
          .replaceAll(TEMP_N, '/n')
          .replaceAll(TEMP_R, '/r')
        fs.writeFile(md, handleMdFiles, () => {
          success++
          console.log('====>', md + 'processing complete')
          if (l === success) {
            res()
          }
        })
      })
    })
  })
}

module.exports = {
  replaceMdFileWords,
}

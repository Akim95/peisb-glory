import fs from 'fs'
import path from 'path'
import jimp from 'jimp'
import moment from 'moment'
import rn from 'random-number'
import md5 from 'md5'

const placeName = 'Desa Lawan Kuda 2, Gopeng'

async function generatePhotoTimestamp(file: string, timestamp: any) {
  console.log(timestamp)


  if (path.extname(file) !== '.jpeg') {
    return
  }

  const filename = md5(String(rn({ min: 1, max: 10000, integer: true })))

  const image = await jimp.read(__dirname + '/photos/' + file)

  const blackF = await jimp.loadFont(jimp.FONT_SANS_32_BLACK)
  const whiteF = await jimp.loadFont(jimp.FONT_SANS_32_WHITE)

  image.print(blackF, 11, 11, timestamp, (err, image) => {
    image.print(whiteF, 10, 10, timestamp)
  })

  image.print(blackF, 11, 51, placeName, (err, image) => {
    image.print(whiteF, 10, 50, placeName)
  })

  // const imageHeight = image.getHeight();
  // const imageWidth = image.getWidth()

  // image.print(
  //   blackF,
  //   0,
  //   0,
  //   {
  //     text: 'Hello world!',
  //     alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
  //     alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
  //   },
  //   imageWidth,
  //   imageHeight,
  // );

  await image.writeAsync(__dirname + `/results/${filename}.jpeg`)
}

let initTimestamp = moment('Oct 19, 2022 09:46:07', 'MMM D, YYYY HH:mm:ss')

fs.readdirSync(__dirname + '/photos').forEach(async (file) => {
  let randomAddMinutes = rn({ min: 1, max: 2, integer: true })
  let randomAddSeconds = rn({ min: 1, max: 60, integer: true })
  initTimestamp = initTimestamp.add(randomAddMinutes, 'minutes').seconds(randomAddSeconds)

  await generatePhotoTimestamp(file, initTimestamp.format('MMM D, YYYY HH:mm:ss'))
})

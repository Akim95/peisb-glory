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

  const imageHeight = image.getHeight()
  const imageWidth = image.getWidth()

  const infoBg = await jimp.create(imageWidth, imageHeight - (60 / 100) * imageHeight, 0xffffffff)
  infoBg.opacity(0.3)

  image.composite(infoBg, 0, imageHeight - (35 / 100) * imageHeight)

  const blackF = await jimp.loadFont(jimp.FONT_SANS_32_BLACK)
  const whiteF = await jimp.loadFont(jimp.FONT_SANS_32_WHITE)

  // image.print(blackF, 11, 11, timestamp, (err, image) => {
  //   image.print(whiteF, 10, 10, timestamp)
  // })

  // image.print(blackF, 11, 51, placeName, (err, image) => {
  //   image.print(whiteF, 10, 50, placeName)
  // })

  image.print(
    blackF,
    10,
    0,
    {
      text: 'Laluan Cinta 1',
      alignmentX: jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
    },
    imageWidth,
    imageHeight - (23 / 100) * imageHeight
  )

  image.print(
    blackF,
    0,
    0,
    {
      text: 'Sebelum',
      alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
    },
    imageWidth,
    imageHeight - (8 / 100) * imageHeight
  )

  image.print(
    blackF,
    0,
    0,
    {
      text: 'R03',
      alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
    },
    imageWidth,
    imageHeight - (3 / 100) * imageHeight
  )

  image.print(
    blackF,
    10,
    0,
    {
      text: 'Taman Rindu',
      alignmentX: jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
    },
    imageWidth,
    imageHeight - (18 / 100) * imageHeight
  )

  image.print(
    blackF,
    10,
    0,
    {
      text: '01/10/2022',
      alignmentX: jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
    },
    imageWidth,
    imageHeight - (13 / 100) * imageHeight
  )

  image.print(
    blackF,
    10,
    0,
    {
      text: '10:30 PM',
      alignmentX: jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
    },
    imageWidth,
    imageHeight - (8 / 100) * imageHeight
  )

  image.print(
    blackF,
    10,
    0,
    {
      text: 'ZON A / P12',
      alignmentX: jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
    },
    imageWidth,
    imageHeight - (3 / 100) * imageHeight
  )

  await image.writeAsync(__dirname + `/results/${filename}.jpeg`)
}

let initTimestamp = moment('Oct 19, 2022 09:46:07', 'MMM D, YYYY HH:mm:ss')

fs.readdirSync(__dirname + '/photos').forEach(async (file) => {
  let randomAddMinutes = rn({ min: 1, max: 2, integer: true })
  let randomAddSeconds = rn({ min: 1, max: 60, integer: true })
  initTimestamp = initTimestamp.add(randomAddMinutes, 'minutes').seconds(randomAddSeconds)

  await generatePhotoTimestamp(file, initTimestamp.format('MMM D, YYYY HH:mm:ss'))
})

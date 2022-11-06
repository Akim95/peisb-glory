import fs from 'fs'
import path from 'path'
import jimp from 'jimp'
import moment from 'moment'
import rn from 'random-number'


let initTimestamp = moment('Oct 19, 2022 09:46:07', 'MMM D, YYYY HH:mm:ss')

const scopes = ['RO3', 'R07', 'R05']
const status = ['Sebelum', 'Selepas']

const placeID = 0
const placeRawData: any = fs.readFileSync('p20.json')
const place = JSON.parse(placeRawData).places[placeID]

const jobScope = scopes[0]
const jobStatus = status[0]
const zone = 'Zon C'
const noPackage = 'KM20'

async function generatePhotoTimestamp(file: string, timestamp: any) {
  console.log(timestamp)

  const generatedDateTime = moment(timestamp, 'MMM D, YYYY HH:mm:ss')
  const fileExt = path.extname(file)
  const fileName = path.basename(file, fileExt)

  console.log(fileExt)
  console.log(fileName)

  if (fileExt !== '.jpeg') {
    return
  }

  const image = await jimp.read(__dirname + '/photos/' + file)
  image.resize(1280 ,  960)

  const logo = await jimp.read(__dirname + '/logo.png')

  logo.resize(135, 135)
  logo.opacity(0.9)

  const imageHeight = image.getHeight()
  const imageWidth = image.getWidth()

  const blankBg = await jimp.create(imageWidth, imageHeight)
  const infoBg = await jimp.create(imageWidth, imageHeight - (71 / 100) * imageHeight, 0xffffffff)

  infoBg.opacity(0.3)

  infoBg.composite(logo, (infoBg.bitmap.width - logo.bitmap.width) - 45, (infoBg.bitmap.height - logo.bitmap.height) - 30)

  blankBg.composite(infoBg, 0, blankBg.bitmap.height - infoBg.bitmap.height)
  image.composite(blankBg, 0, 0)

  const blackF = await jimp.loadFont(jimp.FONT_SANS_32_BLACK)

  image.print(
    blackF,
    15,
    0,
    {
      text: place.roads[fileName].name,
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
      text: jobStatus,
      alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
    },
    imageWidth,
    imageHeight - (6 / 100) * imageHeight
  )

  image.print(
    blackF,
    0,
    0,
    {
      text: jobScope,
      alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
    },
    imageWidth,
    imageHeight - (1 / 100) * imageHeight
  )

  image.print(
    blackF,
    15,
    0,
    {
      text: place.name,
      alignmentX: jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
    },
    imageWidth,
    imageHeight - (18 / 100) * imageHeight
  )

  image.print(
    blackF,
    15,
    0,
    {
      text: generatedDateTime.format('DD/MM/YYYY'),
      alignmentX: jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
    },
    imageWidth,
    imageHeight - (13 / 100) * imageHeight
  )

  image.print(
    blackF,
    15,
    0,
    {
      text: generatedDateTime.format('hh:mm A'),
      alignmentX: jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
    },
    imageWidth,
    imageHeight - (8 / 100) * imageHeight
  )

  image.print(
    blackF,
    15,
    0,
    {
      text: `${zone} / ${noPackage}`,
      alignmentX: jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
    },
    imageWidth,
    imageHeight - (3 / 100) * imageHeight
  )

  await image.writeAsync(__dirname + `/results/${fileName}.jpeg`)
}

fs.readdirSync(__dirname + '/photos').forEach(async (file) => {
  let randomAddMinutes = rn({ min: 1, max: 2, integer: true })
  let randomAddSeconds = rn({ min: 1, max: 60, integer: true })
  initTimestamp = initTimestamp.add(randomAddMinutes, 'minutes').seconds(randomAddSeconds)

  await generatePhotoTimestamp(file, initTimestamp.format('MMM D, YYYY HH:mm:ss'))
})

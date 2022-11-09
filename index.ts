import fs from 'fs'
import path from 'path'
import jimp from 'jimp'
import moment from 'moment'
import rn from 'random-number'

const generatorVersion: string = 'v2'
let initTimestamp = moment('Nov 08, 2022 11:10:52', 'MMM D, YYYY HH:mm:ss')

const scopes = ['R03', 'R07', 'R05']
const status = ['Sebelum', 'Selepas']

const placeID = 2
const placeRawData: any = fs.readFileSync('p20.json')
const place = JSON.parse(placeRawData).places[placeID]

const jobScope = scopes[0]
const jobStatus = status[0]
const zone = 'Zon C'
const noPackage = 'KM20'

async function generatePhotoTimestamp(file: string, timestamp: any) {
  console.log(timestamp)

  const blackF = await jimp.loadFont(jimp.FONT_SANS_32_BLACK)

  const blackF38 = await jimp.loadFont('peisb.fnt')
  const blackF39 = await jimp.loadFont('peisb-39.fnt')
  const blackF40 = await jimp.loadFont('peisb-40.fnt')
  const blackF42 = await jimp.loadFont('peisb-42.fnt')

  const whiteF = await jimp.loadFont(jimp.FONT_SANS_32_WHITE)

  const generatedDateTime = moment(timestamp, 'MMM D, YYYY HH:mm:ss')
  const fileExt = path.extname(file)
  const fileName = path.basename(file, fileExt)

  if (fileExt !== '.jpeg') {
    return
  }

  const image = await jimp.read(__dirname + '/photos/' + file)

  if (generatorVersion === 'v2') {
    const logo = await jimp.read(__dirname + '/logo.png')

    logo.resize(124, 124)
    logo.brightness(-0.17)

    const imageHeight = image.getHeight()
    const imageWidth = image.getWidth()

    const blankBg = await jimp.create(imageWidth, imageHeight)
    const infoBg = await jimp.create(imageWidth, imageHeight - (73 / 100) * imageHeight, 0xffffffff)

    infoBg.opacity(0.2)

    infoBg.composite(
      logo,
      Math.floor(infoBg.bitmap.width - logo.bitmap.width - 45),
      Math.floor(infoBg.bitmap.height - logo.bitmap.height - 30)
    )

    blankBg.composite(infoBg, 0, blankBg.bitmap.height - infoBg.bitmap.height)
    image.composite(blankBg, 0, 0)

    image.print(
      blackF38,
      0,
      0,
      {
        text: jobStatus,
        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
      },
      imageWidth,
      imageHeight - 45
    )

    image.print(
      blackF39,
      0,
      0,
      {
        text: jobScope,
        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
      },
      imageWidth,
      imageHeight
    )

    image.print(
      blackF39,
      20,
      0,
      {
        text: place.roads[fileName].name,
        alignmentX: jimp.HORIZONTAL_ALIGN_LEFT,
        alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
      },
      imageWidth,
      blankBg.bitmap.height - infoBg.bitmap.height + 65,
      (err, image, { x, y }) => {
        image.print(blackF38, 20, y, place.name, (err, image, { x, y }) => {
          image.print(blackF38, 20, y, generatedDateTime.format('DD/MM/YYYY'), (err, image, { x, y }) => {
            image.print(blackF38, 20, y, generatedDateTime.format('hh:mm A'), (err, image, { x, y }) => {
              image.print(blackF38, 20, y, `${zone} / ${noPackage}`, (err, image, { x, y }) => {
                console.log(y)
              })
            })
          })
        })
      }
    )
  } else if (generatorVersion === 'v1') {
    image.print(blackF, 11, 11, timestamp, (err, image) => {
      image.print(whiteF, 10, 10, timestamp)
    })

    image.print(blackF, 11, 51, `${place.name}, Gopeng`, (err, image) => {
      image.print(whiteF, 10, 50, `${place.name}, Gopeng`)
    })
  } else {
  }

  await image.writeAsync(__dirname + `/results/${fileName}.jpeg`)
}

fs.readdirSync(__dirname + '/photos').forEach(async (file) => {
  let randomAddMinutes = rn({ min: 1, max: 3, integer: true })
  let randomAddSeconds = rn({ min: 1, max: 60, integer: true })
  initTimestamp = initTimestamp.add(randomAddMinutes, 'minutes').seconds(randomAddSeconds)

  await generatePhotoTimestamp(file, initTimestamp.format('MMM D, YYYY HH:mm:ss'))
})

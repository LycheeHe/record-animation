class RecordAnimation {
  canvas
  timeLine
  context
  wholeSecond = 0
  millisecondTime = 0
  liWidth = 0
  durationStart = 0
  initX = 0
  timeText = 0
  firstLineY = 0
  secondLineY = 0
  thirdLineY = 0
  duration = 0

  isStoped = false

  constructor() {
    this.init()
  }
  init() {
    this.canvas = document.getElementById('canvas')
    this.context = this.canvas.getContext('2d')
    this.timeLine = document.getElementById('time-line')
    this.initRecord()
  }
  getSecond(_wholeSecond) {
    const temp = _wholeSecond % 60
    const value = temp < 10 ? '0' + temp : temp
    return value
  }
  getMinute(_wholeSecond) {
    const temp = Math.floor(_wholeSecond / 60) >= 60 ? (Math.floor(_wholeSecond / 60)) % 60 : Math.floor(_wholeSecond / 60)
    const value = temp < 10 ? '0' + temp : temp
    return value
  }
  getHour(_wholeSecond) {
    const temp = Math.floor(_wholeSecond / (60 * 60))
    const value = temp < 10 ? '0' + temp : temp
    return value
  }
  getMillisecond(_wholeSecond) {
    const temp = _wholeSecond % 1000
    const value = temp == 0 ? '00' : temp
    return value
  }
  initRecord = () => {
    this.canvas.style.width = '100%'
    this.canvas.width = window.innerWidth
    this.canvas.height = 180
    this.liWidth = this.canvas.width * 0.125
    this.firstLineY = 18
    this.thirdLineY = this.canvas.height - 22
    this.secondLineY = 92
    // this.secondLineY = this.canvas.height / 2

    this.millisecondTime = 0
    this.wholeSecond = 0
    this.initX = 0
    this.durationStart = 0
    // this.duration = 0
    this.timeText = 0
    this.timeLine.style.left = '0'
    this.draw()
  }
  draw() {
    this.initHorizonalLine()
    this.drawTimeText()
    this.drawDuration()
  }

  beginRecord() {
    this.isStoped = false
    const that = this
    const beginTimestamp = Date.now()
    const timer = setInterval(() => {
      if (this.isStoped) {
        clearInterval(timer)
        clearInterval(durationTimer)
        return
      }
      const nowTimestamp = Date.now()
      that.millisecondTime = nowTimestamp - beginTimestamp
      that.wholeSecond = Math.floor(that.millisecondTime / 1000)
      that.duration = that.millisecondTime % 8000
      that.moveTimeLine()
      that.drawTimeText()
      that.drawWave()
    }, 20)
    const durationTimer = setInterval(() => {
      that.durationStart = Math.round(that.millisecondTime / 1000)
      that.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      that.initHorizonalLine()
      that.drawDuration()
    }, 8000)
  }
  initHorizonalLine() {
    this.context.beginPath()
    this.context.strokeStyle = '#989898'
    this.context.moveTo(0, this.firstLineY)
    this.context.lineTo(this.canvas.width, this.firstLineY)
    this.context.stroke()

    this.context.beginPath()
    this.context.strokeStyle = '#e0e0e0'
    this.context.moveTo(0, this.secondLineY)
    this.context.lineTo(this.canvas.width, this.secondLineY)
    this.context.stroke()

    this.context.beginPath()
    this.context.strokeStyle = '#979797'
    this.context.moveTo(0, this.thirdLineY)
    this.context.lineTo(this.canvas.width, this.thirdLineY)
    this.context.stroke()
  }
  drawDuration() {
    let count = 0
    while (count < 8) {
      const i = this.durationStart + count
      const second = Math.floor(i % 60) < 10 ? '0' + Math.floor(i % 60) : Math.floor(i % 60)
      const fakeMinute = Math.floor(i / 60) >= 60 ? (Math.floor(i / 60)) % 60 : Math.floor(i / 60)
      const minute = fakeMinute < 10 ? '0' + fakeMinute : fakeMinute
      const hour = Math.floor(i / 3600) < 10 ? '0' + Math.floor(i / 3600) : Math.floor(i / 3600)
      const temp = minute + ':' + second
      const text = hour === '00' ? temp : hour + ':' + temp
      let centerX = count * this.liWidth
      this.context.beginPath()
      this.context.strokeStyle = '#b8b8b8'
      this.context.moveTo(centerX, 0)
      this.context.lineTo(centerX, this.firstLineY)
      this.context.stroke()

      centerX = count * this.liWidth + this.liWidth / 2
      this.context.moveTo(centerX, this.firstLineY / 2)
      this.context.lineTo(centerX, this.firstLineY)
      this.context.stroke()

      centerX = count * this.liWidth + 4
      this.context.font = '16px serif'
      this.context.fillStyle = '#797979'
      this.context.fillText(text, centerX, this.firstLineY - 4)
      count++
    }
  }
  //下标时间
  drawTimeText() {
    const timeY = this.canvas.height,
      millisecond = this.getMillisecond(this.millisecondTime),
      second = this.getSecond(this.wholeSecond),
      minute = this.getMinute(this.wholeSecond),
      hour = this.getHour(this.wholeSecond),
      temp = minute + ':' + second + '.' + millisecond
    this.timeText = hour == '00' ? temp : hour + ':' + temp
    this.context.clearRect(0, this.canvas.height - 20, this.canvas.width, this.canvas.height)
    this.context.font = '22px serif'
    this.context.fillStyle = '#303030'
    this.context.fillText(this.timeText, 10, timeY)
  }
  moveTimeLine() {
    this.timeLine.style.left = (12.5 * (this.duration / 1000)) + '%'
  }

  stopRecord() {
    this.isStoped = true
    this.reset()
  }
  reset() {
    this.initRecord()
  }
  drawWave() {
    const that = this
    const basicX = that.liWidth * (that.duration / 1000)
    const max = 62
    let xAxis = basicX
    let volume = this.volume > max ? max : this.volume
    let startY = that.secondLineY - volume
    let endY = that.secondLineY + volume
    if (this.volume > 0) {
      that.context.beginPath()
      that.context.fillStyle = 'red'
      that.context.moveTo(xAxis, startY)
      that.context.lineTo(xAxis - 2, that.secondLineY)
      that.context.lineTo(xAxis + 2, that.secondLineY)
      that.context.fill()
      that.context.moveTo(xAxis, endY)
      that.context.lineTo(xAxis - 2, that.secondLineY)
      that.context.lineTo(xAxis + 2, that.secondLineY)
      that.context.fill()
    } else {
      that.context.beginPath()
      that.context.strokeStyle = 'red'
      that.context.moveTo(xAxis, that.secondLineY - 2)
      that.context.lineTo(xAxis, that.secondLineY + 2)
      that.context.stroke()
    }
  }
  setVolume(volume) {
    this.volume = volume;
  }
}
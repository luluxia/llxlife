import React, { useEffect, useState, useRef } from 'react'
import _ from 'lodash'
import './App.sass'

function Grain() {
  class Grain {
    constructor (el) {
        /**
     * Options
     * Increase the pattern size if visible pattern
     */
        this.patternSize = 150;
        this.patternScaleX = 1;
        this.patternScaleY = 1;
        this.patternRefreshInterval = 3; // 8
        this.patternAlpha = 20; // int between 0 and 255,
  
        /**
     * Create canvas
     */
        this.canvas = el;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.scale(this.patternScaleX, this.patternScaleY);
  
        /**
     * Create a canvas that will be used to generate grain and used as a
     * pattern on the main canvas.
     */
        this.patternCanvas = document.createElement('canvas');
        this.patternCanvas.width = this.patternSize;
        this.patternCanvas.height = this.patternSize;
        this.patternCtx = this.patternCanvas.getContext('2d');
        this.patternData = this.patternCtx.createImageData(this.patternSize, this.patternSize);
        this.patternPixelDataLength = this.patternSize * this.patternSize * 4; // rgba = 4
  
        /**
     * Prebind prototype function, so later its easier to user
     */
        this.resize = this.resize.bind(this);
        this.loop = this.loop.bind(this);
  
        this.frame = 0;
  
        window.addEventListener('resize', this.resize);
        this.resize();
  
        window.requestAnimationFrame(this.loop);
    }
  
    resize () {
        this.canvas.width = window.innerWidth * devicePixelRatio;
        this.canvas.height = window.innerHeight * devicePixelRatio;
    }
  
    update () {
        const {patternPixelDataLength, patternData, patternAlpha, patternCtx} = this;
  
        // put a random shade of gray into every pixel of the pattern
        for (let i = 0; i < patternPixelDataLength; i += 4) {
            // const value = (Math.random() * 255) | 0;
            const value = Math.random() * 255;
  
            patternData.data[i] = value;
            patternData.data[i + 1] = value;
            patternData.data[i + 2] = value;
            patternData.data[i + 3] = patternAlpha;
        }
  
        patternCtx.putImageData(patternData, 0, 0);
    }
  
    draw () {
        const {ctx, patternCanvas, canvas, viewHeight} = this;
        const {width, height} = canvas;
  
        // clear canvas
        ctx.clearRect(0, 0, width, height);
  
        // fill the canvas using the pattern
        ctx.fillStyle = ctx.createPattern(patternCanvas, 'repeat');
        ctx.fillRect(0, 0, width, height);
    }
  
    loop () {
        // only update grain every n frames
        const shouldDraw = ++this.frame % this.patternRefreshInterval === 0;
        if (shouldDraw) {
            this.update();
            this.draw();
        }
  
        window.requestAnimationFrame(this.loop);
    }
  }
  useEffect(() => {
    /**
    * Initiate Grain
    */
    const el = document.querySelector('.grain');
    const grain = new Grain(el);
  }, [])
  return (
    <canvas className="grain"></canvas>
  )
}
function Logo() {
  return (
    <>
      <img src="logo.svg" alt=""/>
      <p className="copyright">© 2021 Luluxia. All Rights Reserved. 萌ICP备 20201224号</p>
    </>
  )
}
function Tip() {
  return (
    <>
      <p>向任意方向拖动屏幕进行浏览</p>
      <p>点击你感兴趣的内容吧</p>
      <i className="iconfont icon-tuozhuai"></i>
    </>
  )
}
function About() {
  return (
    <>
      <h1 className="title">关于</h1>
      <div className="content">
        <p>
          氦！欢迎光临~！我是陆陆侠，一位默默无闻的前端工程师。爱好前端、设计、音游、二次元。
        </p>
        <p>
          这里是我的个人站点——陆陆侠的生活，
          你可以在这里看到我的一些日常动态，包括并不限于我最近追的番、听的歌、玩的游戏等等……尽情探索吧！
        </p>
      </div>
    </>
  )
}
function Link() {
  return (
    <>
      <h1 className="title">链接</h1>
      <p>巴拉巴拉巴拉巴拉巴拉巴拉</p>
    </>
  )
}
function Flag() {
  return (
    <div className="flag">
      <img src="flag-left.svg" alt=""/>
      <img src="flag-right.svg" alt=""/>
    </div>
  )
}
function App() {
  const [gridList, setGridList] = useState([])
  const state = useRef({
    mouseDown: 0,
    offset: { x: 0, y: 0 },
    past: { x: 0, y: 0 },
    mouse: { x: 0, y: 0 },
    change: { x: 0, y: 0 },
    margin: { x: 0, y: 0 },
    bodyRect: { w: 0, h: 0 },
    classList: ['logo', 'link', 'about', 'tip']
  })
  const requestRef = useRef()
  // 按下鼠标
  function sliderDown(e) {
    state.current.mouseDown = 1
    state.current.mouse = {
      x: e.clientX || e.touches[0].clientX,
      y: e.clientY || e.touches[0].clientY
    }
    state.current.past = {
      x: state.current.offset.x,
      y: state.current.offset.y
    }
    state.current.change = { x: 0, y: 0 }
  }
  // 移动鼠标
  function sliderMove(e) {
    if (state.current.mouseDown) {
      const X = e.clientX || e.touches[0].clientX
      const Y = e.clientY || e.touches[0].clientY
      state.current.change = {
        x: state.current.mouse.x - X,
        y: state.current.mouse.y - Y
      }
      // 左边界
      if (state.current.offset.x == state.current.margin.x) {
        state.current.past.x = state.current.margin.x
        state.current.mouse.x = X
      }
      // 右边界
      if (state.current.offset.x == -state.current.margin.x) {
        state.current.past.x = -state.current.margin.x
        state.current.mouse.x = X
      }
      // 上边界
      if (state.current.offset.y == state.current.margin.y) {
        state.current.past.y = state.current.margin.y
        state.current.mouse.y = Y
      }
      // 右边界
      if (state.current.offset.y == -state.current.margin.y) {
        state.current.past.y = -state.current.margin.y
        state.current.mouse.y = Y
      }
    }
  }
  // 鼠标抬起
  function sliderUp() {
    state.current.mouseDown = 0
  }
  // 动画
  function render() {
    state.current.offset = {
      x: state.current.offset.x + ((state.current.past.x - state.current.change.x) - state.current.offset.x) * 0.2,
      y: state.current.offset.y + ((state.current.past.y - state.current.change.y) - state.current.offset.y) * 0.2
    }
    // 左边界
    if (state.current.offset.x > state.current.margin.x) {
      state.current.offset.x = state.current.margin.x
    }
    // 右边界
    if (state.current.offset.x < -state.current.margin.x) {
      state.current.offset.x = -state.current.margin.x
    }
    // 上边界
    if (state.current.offset.y > state.current.margin.y) {
      state.current.offset.y = state.current.margin.y
    }
    // 右边界
    if (state.current.offset.y < -state.current.margin.y) {
      state.current.offset.y = -state.current.margin.y
    }
    document.querySelector('.main').style.transform = `translate3d(${state.current.offset.x}px ,${state.current.offset.y}px, 0px)`
    requestRef.current = requestAnimationFrame(render)
  }
  // 边界隐藏
  const hide = _.throttle(() => {
    const bodyWidth = state.current.bodyRect.w
    const bodyHeight = state.current.bodyRect.h
    document.querySelectorAll('.block').forEach(dom => {
      const rect = dom.getClientRects()[0]
      const [top, left, right, height] = [rect.top, rect.left, rect.right, rect.height]
      if (top < -height || top > bodyHeight || right < 0 || left > bodyWidth) {
        dom.classList.add('hide')
      } else {
        dom.classList.remove('hide')
      }
    })
  }, 500)
  useEffect(() => {
    // 初始化
    const [height, width] = [30, 40]
    const grids = []
    const list = Array(height).fill(0).map(() => { return Array(width).fill(0) })
    const type = [
      [4, 4], [2, 2], [1, 2], [2, 1]
    ]
    const defalutGrid = [
      [[11, 15], [5, 5]],
      [[13, 20], [2, 5]],
      [[15, 20], [3, 5]],
      [[16, 15], [1, 5]]
    ]
    let nowType = 0
    let finish = true
    let wrong = 0
    // 完成默认点
    defalutGrid.forEach(item => {
      const [x, y, h, w] = [item[0][0], item[0][1], item[1][0], item[1][1]]
      for (let i = x; i < x + h; i++) {
        for (let j = y; j < y + w; j++) {
          list[i][j] = 1
        }
      }
      grids.push([`${x + 1} / ${y + 1} / ${x + 1 + h} / ${y + 1 + w}`])
    })
    while (finish) {
      let check = true
      // 随机起始点
      const x = Math.floor(Math.random() * (height - type[nowType][0] + 1))
      const y = Math.floor(Math.random() * (width - type[nowType][1] + 1))
      // 判定起始点可用
      for (let i = x; (i < x + type[nowType][0]) && check; i++) {
        for (let j = y; (j < y + type[nowType][1]) && check; j++) {
          if (list[i][j]) {
            wrong++
            check = false
          }
        }
      }
      // 标记占用方块
      if (check) {
        for (let i = x; i < x + type[nowType][0]; i++) {
          for (let j = y; j < y + type[nowType][1]; j++) {
            list[i][j] = 1
          }
        }
        grids.push([`${x + 1} / ${y + 1} / ${x + 1 + type[nowType][0]} / ${y + 1 + type[nowType][1]}`])
        state.current.classList.push('test')
      }
      // 放置下个类型
      if (wrong >= 200) {
        if (nowType < type.length - 1) {
          wrong = 0
          nowType++
        } else {
          finish = false
        }
      }
    }
    // 放入最小单元
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (!list[i][j]) {
          grids.push([`${i + 1} / ${j + 1} / ${i + 2} / ${j + 2}`])
          state.current.classList.push('tree')
        }
      }
    }
    setGridList(grids)
    console.log(list)
    console.log(grids)
    // 计算边界
    const mainDOM = document.querySelector('.main')
    const body = document.body
    state.current.margin.x = - (body.clientWidth - mainDOM.clientWidth) / 2 + 20
    state.current.margin.y = - (body.clientHeight - mainDOM.clientHeight) / 2 + 20

    state.current.bodyRect.w = body.clientWidth
    state.current.bodyRect.h = body.clientHeight
    // 激活拖拽
    requestRef.current = requestAnimationFrame(render)
    return () => cancelAnimationFrame(requestRef.current)
  }, [])
  return (
    <>
    <Grain/>
    <Flag/>
    <div
      onMouseDown={e => {sliderDown(e)}}
      onMouseMove={e => {sliderMove(e), hide()}}
      onMouseUp={e => {sliderUp(e)}}
      onMouseLeave={e => {sliderUp(e)}}

      onTouchStart={e => {sliderDown(e)}}
      onTouchMove={e => {sliderMove(e), hide()}}
      onTouchEnd={e => {sliderUp(e)}}
      className="App"
    >
      <div className="main">
        {
          gridList.map((item, index) => (
            <div className={`${state.current.classList[index] ?? ''} block`} style={{gridArea: item}}>
              { state.current.classList[index] == 'logo' && <Logo/> }
              { state.current.classList[index] == 'about' && <About/> }
              { state.current.classList[index] == 'link' && <Link/> }
              { state.current.classList[index] == 'tip' && <Tip/> }
              { state.current.classList[index] == 'tree' &&
                <img src={`tree${Math.floor(Math.random() * 3 + 1)}.png`} alt=""/>
              }
            </div>
          ))
        }
      </div>
    </div>
    </>
  )
}

export default App
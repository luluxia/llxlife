import React, { useEffect, useState, useRef, useContext } from 'react'
import _ from 'lodash'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import './App.sass'
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
const Context = React.createContext({})
// 噪音
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
        this.patternAlpha = 15; // int between 0 and 255,
  
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
function Flag() {
  return (
    <div className="flag">
      <img src="img/flag-left.svg" alt=""/>
      <img src="img/flag-right.svg" alt=""/>
    </div>
  )
}
function Logo() {
  return (
    <div className="content">
      <img src="img/logo.svg" alt=""/>
      <ul className="menu">
        <li>博文</li>
        <li>相册</li>
        <li>作品</li>
        <li>友链</li>
      </ul>
      <p className="copyright">© 2021 Luluxia. All Rights Reserved. <a href="https://icp.gov.moe" target="_blank">萌ICP备 </a><a href="https://icp.gov.moe/?keyword=20201224" target="_blank"> 20201224号</a></p>
    </div>
  )
}
function Tip() {
  return (
    <div className="content">
      <p>向任意方向拖动屏幕进行浏览</p>
      <p>点击你感兴趣的内容吧</p>
      <div className="block-icon">
        <i className="iconfont icon-tuozhuai"></i>
      </div>
    </div>
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
  const { state } = useContext(Context)
  const links = [
    'https://weibo.com/u/1926779340',
    'https://space.bilibili.com/1802865',
    'https://steamcommunity.com/id/sixsixman/',
    'https://music.163.com/#/user/home?id=52350671',
    'https://github.com/luluxia',
    'https://www.zhihu.com/people/lu-yang-20-42',
    'https://www.douban.com/people/120242819/',
    'https://twitter.com/luluxia_'
  ]
  function link(id) {
    state.current.change.x + state.current.change.y || window.open(links[id])
  }
  return (
    <>
      <h1 className="title">链接</h1>
      <div className="content">
        <ul>
          <li onMouseUp={() => link(0)}><i className="iconfont icon-weibo"></i></li>
          <li onMouseUp={() => link(1)}><i className="iconfont icon-bili"></i></li>
          <li onMouseUp={() => link(2)}><i className="iconfont icon-steam"></i></li>
          <li onMouseUp={() => link(3)}><i className="iconfont icon-neteasemusic"></i></li>
          <li onMouseUp={() => link(4)}><i className="iconfont icon-github"></i></li>
          <li onMouseUp={() => link(5)}><i className="iconfont icon-zhihu"></i></li>
          <li onMouseUp={() => link(6)}><i className="iconfont icon-douban"></i></li>
          <li onMouseUp={() => link(7)}><i className="iconfont icon-twitter"></i></li>
        </ul>
      </div>
    </>
  )
}
function Card(props) {
  return (
    <>
    <h1 className="title">博文<span>作品诞生记</span></h1>
    <div className="content skew-title">
      <h2>关于陆陆侠的生活</h2>
      <p>2021/7/30</p>
    </div>
    <img src="img/test.jpg" alt="" />
    </>
  )
}
function Box(props) {
  const { boxState, setBoxState } = useContext(Context)
  const [data, setData] = useState({
    width: 0,
    height: 0,
    sub: 0,
    scroll: 0
  })
  const boxRef = useRef()
  const subBoxRef = useRef()
  const coverRef = useRef()
  // 关闭盒子
  function closeBox() {
    setBoxState({
      ...boxState,
      active: 0
    })
  }
  // 打开二级
  function openSub() {
    // 还原二级状态
    subBoxRef.current.parentNode.style.top = 'inherit'
    subBoxRef.current.parentNode.style.position = 'absolute'
    // 隐藏一级显示二级，并记录滚动条
    setBoxState({
      ...boxState,
      sub: 1,
      scroll: coverRef.current.scrollTop
    })
    // 锁定一级，使其不跟随滚动条移动
    boxRef.current.parentNode.style.top = `-${coverRef.current.scrollTop}px`
    boxRef.current.parentNode.style.position = 'fixed'
    // 滚动条移至顶部
    coverRef.current.scrollTop = 0
  }
  // 关闭二级
  function closeSub() {
    // 隐藏二级显示一级
    setBoxState({
      ...boxState,
      sub: 0
    })
    // 锁定二级，使其不跟随滚动条移动
    subBoxRef.current.parentNode.style.top = `-${coverRef.current.scrollTop}px`
    subBoxRef.current.parentNode.style.position = 'fixed'
    // 还原一级状态
    setTimeout(() => {
      boxRef.current.parentNode.style.top = 'inherit'
      boxRef.current.parentNode.style.position = 'absolute'
      coverRef.current.scrollTop = boxState.scroll
    }, 300)
  }
  // 打开盒子
  useEffect(() => {
    if (boxState.active) {
      const target = boxState.sub ? subBoxRef : boxRef
      setData({
        width: target.current.clientWidth + 100,
        height: target.current.clientHeight >= document.body.clientHeight ? document.body.clientHeight : target.current.clientHeight + 100
      })
    }
  }, [boxState.active, boxState.sub])
  return (
    <>
    <div ref={e => {coverRef.current = e}} className={`${boxState.active ? 'cover-active' : ''} cover`}>
      <div className="cover-halftone">
        <div className="cover-halftone-color" style={{width: `${data.width}px`, height: `${data.height}px`}}></div>
      </div>
      <div
        onClick={() => {closeBox()}}
        className={`box-cover box-article ${boxState.sub ? 'hide-box' : ''}`}
        style={{transformOrigin: `${boxState.x}px ${boxState.y}px`}}
      >
        <div onClick={e => {e.stopPropagation()}} ref={e => {boxRef.current = e}} className="box pixel-top">
          <div className="box-content pixel-bottom">
            <h1 className="box-title">博文</h1>
            <div onClick={() => {openSub()}} className="article-list">
              <div className="article-item">
                <p className="article-time">2021-8-8</p>
                <p className="article-title">关于陆陆侠的生活</p>
                <p className="article-tag">作品诞生记</p>
              </div>
              <div className="article-item">
                <p className="article-time">2021-8-8</p>
                <p className="article-title">关于陆陆侠的生活</p>
                <p className="article-tag">作品诞生记</p>
              </div>
              <div className="article-item">
                <p className="article-time">2021-8-8</p>
                <p className="article-title">关于陆陆侠的生活</p>
                <p className="article-tag">作品诞生记</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => {closeSub()}}
        className={`box-cover box-article ${!boxState.sub ? 'hide-box' : ''}`}
        style={{position: 'fixed'}}
      >
        <div onClick={e => {e.stopPropagation()}} ref={e => {subBoxRef.current = e}} className="box pixel-top">
          <div className="box-content pixel-bottom">
            <p>这里是二级区域</p>.
            <p>这里是二级区域</p>
            <p>这里是二级区域</p>
            <p>这里是二级区域</p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
function App() {
  const [gridList, setGridList] = useState([])
  const [boxState, setBoxState] = useState({
    active: 0,
    anime: 0,
    x: 0,
    y: 0
  })
  const state = useRef({
    renderRun: 1,
    mouseDown: 0,
    offset: { x: 0, y: 0 },
    past: { x: 0, y: 0 },
    mouse: { x: 0, y: 0 },
    change: { x: 0, y: 0 },
    margin: { x: 0, y: 0 },
    bodyRect: { w: 0, h: 0 },
    blockInfo: [
      { class: 'logo' },
      { class: 'link' },
      { class: 'about' },
      { class: 'tip' },
      { class: 'card osu' }
    ],
    blockRects: []
  })
  const blockRef = useRef([])
  const requestRef = useRef()
  const appRef = useRef()
  const [data, setData] = useState()
  // 按下鼠标
  function sliderDown(e) {
    state.current.mouseDown = 1
    appRef.current.classList.add('move')
    state.current.mouse = {
      x: e.clientX ?? e.touches[0].clientX,
      y: e.clientY ?? e.touches[0].clientY
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
      const X = e.clientX ?? e.touches[0].clientX
      const Y = e.clientY ?? e.touches[0].clientY
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
      // 下边界
      if (state.current.offset.y == -state.current.margin.y) {
        state.current.past.y = -state.current.margin.y
        state.current.mouse.y = Y
      }
    }
  }
  // 鼠标抬起
  function sliderUp() {
    state.current.mouseDown = 0
    appRef.current.classList.remove('move')
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
    if (state.current.renderRun) {
      document.querySelector('.main').style.transform = `translate3d(${state.current.offset.x}px ,${state.current.offset.y}px, 0px)`
    }
    requestRef.current = requestAnimationFrame(render)
  }
  // 返回中间点
  function returnCenter() {
    state.current = {
      ...state.current,
      offset: { x: 0, y: 0 },
      past: { x: 0, y: 0 },
      change: { x: 0, y: 0 },
      renderRun: 0
    }
    const dom = document.querySelector('.main')
    dom.style.transition = 'transform 0.6s'
    dom.style.transform = `translate3d(0px ,0px, 0px)`
    setTimeout(() => {
      dom.style.transition = 'none'
      state.current.renderRun = 1
      // 重新判断一次边界隐藏
      const bodyWidth = state.current.bodyRect.w
      const bodyHeight = state.current.bodyRect.h
      state.current.blockRects.forEach((rect, index) => {
        const [x , y] = [state.current.offset.x, state.current.offset.y]
        const [top, left, right, height] = [rect.top + y, rect.left + x, rect.right + x, rect.height]
        const target = blockRef.current[index]
        if (top < -height || top > bodyHeight || right < 0 || left > bodyWidth) {
          target.style.display = 'none'
          target.classList.add('hide')
        } else {
          target.style.display = 'flex'
          setTimeout(() => {
            target.classList.remove('hide')
          }, 50)
        }
      })
    }, 600);
  }
  // 卡片点击事件
  function openCard(e) {
    state.current.change.x + state.current.change.y || 
    setBoxState({
      ...boxState,
      active: 1,
      x: e.currentTarget.getClientRects()[0].x + e.currentTarget.clientWidth / 2,
      y: e.currentTarget.getClientRects()[0].y + e.currentTarget.clientHeight / 2,
    })
  }
  // 边界隐藏
  const hide = _.throttle(() => {
    const bodyWidth = state.current.bodyRect.w
    const bodyHeight = state.current.bodyRect.h
    state.current.blockRects.forEach((rect, index) => {
      const [x , y] = [state.current.offset.x, state.current.offset.y]
      const [top, left, right, height] = [rect.top + y, rect.left + x, rect.right + x, rect.height]
      const target = blockRef.current[index]
      if (top < -height || top > bodyHeight || right < 0 || left > bodyWidth) {
        target.style.display = 'none'
        target.classList.add('hide')
      } else {
        target.style.display = 'flex'
        setTimeout(() => {
          target.classList.remove('hide')
        }, 50)
      }
    })
  }, 500)
  useEffect(() => {
    // 初始化
    const [height, width] = [36, 60]
    const grids = []
    const list = Array(height).fill(0).map(() => { return Array(width).fill(0) })
    // 第四个开始用于测试
    const defalutGrid = [
      [[15, 25], [5, 5]],
      [[15, 30], [2, 5]],
      [[17, 30], [3, 5]],
      [[20, 25], [1, 10]],
      [[15, 35], [3, 5]]
    ]
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
    for (let x = 0; x < height; x+=3) {
      for (let y = 0; y < width; y+=5) {
        // 610 615 910 915
        // 排除默认
        if (!['1525', '1530', '1825', '1830', '1535'].includes(`${x}${y}`)) {
          grids.push([`${x + 1} / ${y + 1} / ${x + 4} / ${y + 6}`])
          state.current.blockInfo.push({ class: '' })
        }
      }
    }
    setGridList(grids)
    // 激活拖拽
    requestRef.current = requestAnimationFrame(render)
    return () => cancelAnimationFrame(requestRef.current)
  }, [])
  // 记录方块边界
  useEffect(() => {
    if (gridList != '') {
      const blockRects = []
      blockRef.current.forEach(dom => {
        const rect = dom.getClientRects()[0]
        blockRects.push({
          top: rect.top,
          left: rect.left,
          right: rect.right,
          height: rect.height
        })
      })
      state.current.blockRects = blockRects
    }
  }, [gridList])
  useEffect(() => {
    // 计算边界
    const mainDOM = document.querySelector('.main')
    const body = document.body
    state.current.margin.x = - (body.clientWidth - mainDOM.clientWidth) / 2 + 20
    state.current.margin.y = - (body.clientHeight - mainDOM.clientHeight) / 2 + 60

    state.current.bodyRect.w = body.clientWidth
    state.current.bodyRect.h = body.clientHeight
    hide()
  })
  return (
    <>
    <Context.Provider value={{...data, state, boxState, setBoxState}}>
      <Grain/>
      <Flag/>
      <div onClick={() => {returnCenter()}} className="home">
        <img src="img/home.svg" alt=""/>
      </div>
      <Box/>
      <div
        onMouseDown={e => {sliderDown(e)}}
        onMouseMove={e => {sliderMove(e), hide()}}
        onMouseUp={e => {sliderUp(e)}}
        onMouseLeave={e => {sliderUp(e)}}

        onTouchStart={e => {sliderDown(e)}}
        onTouchMove={e => {sliderMove(e), hide()}}
        onTouchEnd={e => {sliderUp(e)}}
        className="App"
        ref={e => {appRef.current = e}}
      >
        <div className="main">
          {
            gridList.map((item, index) => {
              const className = state.current.blockInfo[index].class
              const id = state.current.blockInfo[index].id
              return (
                <div
                  ref={e => {blockRef.current[index] = e}}
                  className={`${className ?? ''} block`}
                  style={{gridArea: item, transitionDelay: `${Math.floor(Math.random()*(200+1))}ms`}}
                  key={index}
                  onClick={e => {openCard(e)}}
                >
                  { className == 'painting' &&
                    <img src={`img/painting${Math.floor(Math.random() * 6 + 1)}.png`} alt=""/>
                  }
                  { className == 'pokemon' &&
                    <img src={`https://cn.portal-pokemon.com/play/resources/pokedex${data.pokemon[id]}`} alt=""/>
                  }
                  { className == 'logo' && <Logo/> }
                  { className == 'about' && <About/> }
                  { className == 'link' && <Link/> }
                  { className == 'tip' && <Tip/> }
                  { className.slice(0, 4) == 'card' && <Card/> }
                </div>
              )
            })
          }
        </div>
      </div>
    </Context.Provider>
    </>
  )
}

export default App
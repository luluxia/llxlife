import React, { useEffect, useState, useRef, useContext } from 'react'
import _ from 'lodash'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import './App.sass'
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
const Context = React.createContext({})
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
    <>
      <img src="img/logo.svg" alt=""/>
      <p></p>
      <p className="copyright">© 2021 Luluxia. All Rights Reserved. <a href="https://icp.gov.moe" target="_blank">萌ICP备 </a><a href="https://icp.gov.moe/?keyword=20201224" target="_blank"> 20201224号</a></p>
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
function NetEaseMusic(props) {
  const { netEaseMusic, state } = useContext(Context)
  function link() {
    state.current.change.x + state.current.change.y || window.open(`https://music.163.com/#/song?id=${netEaseMusic[props.id].id}`)
  }
  return (
    <>
    <h1 className="title">网易云音乐·红心</h1>
    <div onClick={() => link()} className="content">
      <div className="music">
        <img src={`${netEaseMusic[props.id].pic}?param=200y200`} alt=""/>
        <div className="music-info">
          <h2 className="music-title">{netEaseMusic[props.id].title}</h2>
          <p className="music-tip">{netEaseMusic[props.id].sub}</p>
        </div>
      </div>
    </div>
    <i className="iconfont icon-neteasemusic"></i>
    </>
  )
}
function BilibiliAnime(props) {
  const { biliBangumi, state } = useContext(Context)
  function link() {
    state.current.change.x + state.current.change.y || window.open(biliBangumi[props.id].url)
  }
  return (
    <>
    <h1 className="title">哔哩哔哩·追番</h1>
    <div onClick={() => link()} className="content">
      <div className="bilibili-anime-content">
        <img src={biliBangumi[props.id].pic} referrerPolicy="no-referrer" alt=""/>
        <div className="bilibili-info">
          <h2 className={biliBangumi[props.id].title.length <= 4 ? 'big-title' : undefined}>{biliBangumi[props.id].title}</h2>
          <p>{biliBangumi[props.id].progress}</p>
        </div>
      </div>
    </div>
    <i className="iconfont icon-bili"></i>
  </>
  )
}
function BilibiliVideo(props) {
  const { biliStar, biliUpload, state } = useContext(Context)
  function link() {
    state.current.change.x + state.current.change.y || window.open(`https://www.bilibili.com/video/${props.id < 4 ? biliStar[props.id].id : biliUpload[props.id - 4].id}`)
  }
  return (
    <>
    <h1 className="title">哔哩哔哩·{props.id < 4 ? '收藏' : '上传'}</h1>
    <div onClick={() => link()} className="content">
      <div className="bilibili-video-content">
        <img src={props.id < 4 ? biliStar[props.id].pic : biliUpload[props.id - 4].pic} referrerPolicy="no-referrer" alt=""/>
        <div className="bilibili-info">
          <h2>{props.id < 4 ? biliStar[props.id].title : biliUpload[props.id - 4].title}</h2>
          <p>{dayjs(dayjs.unix(props.id < 4 ? biliStar[props.id].time : biliUpload[props.id - 4].time)).fromNow()}</p>
        </div>
      </div>
    </div>
    <i className="iconfont icon-bili"></i>
  </>
  )
}
function OSU(props) {
  const { osuActicity, state } = useContext(Context)
  function link() {
    state.current.change.x + state.current.change.y || window.open(`https://osu.ppy.sh/b/${osuActicity[props.id - 4].id}`)
  }
  return (
    <>
    <h1 className="title">OSU·活动</h1>
    <div onClick={() => link()} className="content">
      <div className="osu-map">
        <img className="osu-pic" src={osuActicity[props.id - 4].pic} alt=""/>
        <div className="record-info">
          <h2>{osuActicity[props.id - 4].title}</h2>
          <p>{dayjs(osuActicity[props.id - 4].time).fromNow()}取得 #{osuActicity[props.id - 4].rank}</p>
        </div>
        <img className="rank" src={`img/osurank-${osuActicity[props.id - 4].scoreRank}.svg`} alt=""/>
      </div>
    </div>
    </>
  )
}
function NintendoSwitchGame(props) {
  const { nintendoSwitchGame, state } = useContext(Context)
  function link() {
    state.current.change.x + state.current.change.y || window.open(`https://tinfoil.io/Title/${nintendoSwitchGame[props.id - 4].id}`)
  }
  return (
    <>
    <h1 className="title">Nintendo Switch·活动</h1>
    <div onClick={() => link()} className="content">
      <div className="nintendo-switch-content">
        <img src={nintendoSwitchGame[props.id - 4].pic} alt=""/>
        <div className="nintendo-switch-info">
          <h2>{nintendoSwitchGame[props.id - 4].title}</h2>
          <p>{dayjs(nintendoSwitchGame[props.id - 4].time).fromNow()}</p>
        </div>
      </div>
    </div>
    <i className="iconfont icon-switch"></i>
  </>
  )
}
function Github(props) {
  const { github, state } = useContext(Context)
  function link(type) {
    console.log(type)
    if (!(state.current.change.x + state.current.change.y)) {
      if (type == 'repo') {
        window.open(`https://github.com/${github[props.id].repo}`)
      } else if (type == 'ref') {
        window.open(`https://github.com/${github[props.id].repo}/tree/${github[props.id].ref}`)
      } else if (type == 'commit') {
        window.open(`https://github.com/${github[props.id].repo}/commit/${github[props.id].commit.id}`)
      }
    }
  }
  return (
    <>
    <h1 className="title">Github·活动</h1>
    <div className="content">
      { github[props.id].action == 'star' &&
        <h2>stared <span onClick={() => link('repo')} className="github-link">{github[props.id].repo}</span></h2>
      }
      { github[props.id].action == 'create' &&
        <h2>created <span onClick={() => link('repo')} className="github-link">{github[props.id].repo}</span></h2>
      }
      { github[props.id].action == 'push' &&
        <>
          <h2>pushed to <span onClick={() => link('ref')} className="github-link">{github[props.id].ref}</span> at <span onClick={() => link('repo')} className="github-link">{github[props.id].repo}</span></h2>
          <p className="github-info"><span onClick={() => link('commit')} className="github-link">{github[props.id].commit.id.substr(0, 7)}</span> {github[props.id].commit.content}</p>
        </>
      }
      <p className="time">{dayjs(github[props.id].time).fromNow()}</p>
    </div>
    <i className="iconfont icon-github"></i>
    </>
  )
}
function App() {
  const [gridList, setGridList] = useState([])
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
      { class:'logo' },
      { class:'link' },
      { class:'about' },
      { class:'tip' }
    ],
    blockRects: []
  })
  const blockRef = useRef([])
  const requestRef = useRef()
  const [data, setData] = useState()
  // 按下鼠标
  function sliderDown(e) {
    state.current.mouseDown = 1
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
    dom.style.transition = 'transform 0.3s'
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
    }, 300);
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
    const [height, width] = [24, 34]
    const grids = []
    const list = Array(height).fill(0).map(() => { return Array(width).fill(0) })
    const type = [
      [4, 4], [3, 4], [2, 4], [2, 5], [2, 2]
    ]
    // 哔哩哔哩上传/收藏；哔哩哔哩追番/Switch游戏；网易云音乐红心/OSU；GitHub
    const typeMax = [8, 8, 8, 4, 30]
    const typeNum = [0, 0, 0, 0, 0]
    // 第四个开始用于测试
    const defalutGrid = [
      [[8, 12], [5, 5]],
      [[10, 17], [2, 5]],
      [[12, 17], [3, 5]],
      [[13, 12], [1, 5]],
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
      // 随机空白起始点
      let x = Math.floor(Math.random() * (height - type[nowType][0] + 1))
      let y = Math.floor(Math.random() * (width - type[nowType][1] + 1))
      while (list[x][y]) {
        x = Math.floor(Math.random() * (height - type[nowType][0] + 1))
        y = Math.floor(Math.random() * (width - type[nowType][1] + 1))
      }
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
        // 哔哩哔哩上传4/收藏4；哔哩哔哩追番4/Switch游戏4；网易云音乐红心4/OSU4；GitHub4
        const id = typeNum[nowType]
        state.current.blockInfo.push({
          id: id,
          class: (() => {
            if (nowType == 0) {
              return 'bilibili-video'
            } else if (nowType == 1) {
              return id < 4 ? 'bilibili-anime' : 'nintendo-switch-game'
            } else if (nowType == 2) {
              return id < 4 ? 'neteasemusic' : 'osu'
            } else if (nowType == 3) {
              return 'github'
            } else {
              return 'pokemon'
            }
          })()
        })
        typeNum[nowType]++
      }
      // 放置下个类型
      if (wrong >= 100 || typeNum[nowType] == typeMax[nowType]) {
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
          state.current.blockInfo.push({ class: 'painting' })
        }
      }
    }
    fetch('api/data.json').then(res => {
      return res.json()
    }).then(data => {
      setData(data)
      setGridList(grids)
    })
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
  return (
    <>
    <Grain/>
    <Flag/>
    <div className="home">
      <img onClick={() => {returnCenter()}} src="img/home.svg" alt=""/>
    </div>
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
      <Context.Provider value={{...data, state}}>
      <div className="main">
        {
          gridList.map((item, index) => {
            const className = state.current.blockInfo[index].class
            const id = state.current.blockInfo[index].id
            return (
              <div
                ref={e => {blockRef.current[index] = e}}
                className={`${className ?? ''} block`}
                style={{gridArea: item}}
                key={index}
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
                { className == 'neteasemusic' && <NetEaseMusic id={id}/> }
                { className == 'bilibili-anime' && <BilibiliAnime id={id}/> }
                { className == 'bilibili-video' && <BilibiliVideo id={id}/> }
                { className == 'osu' && <OSU id={id}/> }
                { className == 'nintendo-switch-game' && <NintendoSwitchGame id={id}/> }
                { className == 'github' && <Github id={id}/> }
              </div>
            )
          })
        }
      </div>
      </Context.Provider>
    </div>
    </>
  )
}

export default App
import React, { useEffect, useState, useRef, useContext } from 'react'
import Grain from './card/Grain'
import Flag from './card/Flag'
import Logo from './card/Logo'
import Tip from './card/Tip'
import About from './card/About'

import ArticleList from './box/ArticleList'
import Article from './box/Article'
import PhotoList from './box/PhotoList'
import Photo from './box/Photo'
import FriendList from './box/Friend'

import _, { set } from 'lodash'
import './App.sass'
import { pokemon } from './pokemon.json'
import { Route, Switch, useHistory, withRouter, useLocation } from 'react-router-dom'

const Context = React.createContext({})
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
  const [data, setData] = useState({})
  useEffect(() => {
    if (props.data && props.data.time) {
      if (!isNaN(Number(props.data.time))) {
        props.data.time = Number(props.data.time)
      }
      const time = new Intl
        .DateTimeFormat("cn-ZH", { dateStyle: 'short', timeStyle: 'short', hour12: false })
        .format(new Date(props.data.time))
      props.data.subTitle = props.data.subTitle.replace('$TIME$', time)
    }
    setData(props.data)
  }, [props.data])
  return (
    <>
    {
      data &&
      <>
        <img src={data.img} referrerPolicy="no-referrer" alt="" />
        <div className="card-cover"></div>
        <h1 className="title">{props.data?.type}<span>{props.data?.subType}</span></h1>
        <div className="content skew-title">
          <h2 style={{fontSize: props.data?.title.length >= 10 && '1.5em'}}>{props.data?.title}</h2>
          <p>{props.data?.subTitle}</p>
        </div>
      </>
    }
    </>
  )
}
function RandomArt() {
  const [random, setRandom] = useState(0)
  useEffect(() => {
    setRandom(Math.floor(Math.random() * 1081))
  }, [])
  return (
    <>
    <div>
      {
        random && <img src={'https://cn.portal-pokemon.com/play/resources/pokedex' + pokemon[random]} alt="" />
      }
    </div>
    </>
  )
}
function Box(props) {
  const { boxState, setBoxState } = useContext(Context)
  const [data, setData] = useState({
    width: 0,
    height: 0,
    opacity: 0,
    subOpacity: 0
  })
  const boxRef = useRef()
  const subBoxRef = useRef()
  const coverRef = useRef()
  const history = useHistory()
  const location = useLocation()
  // 打开盒子
  useEffect(() => {
    if (boxState.active) {
      const target = boxState.sub ? subBoxRef : boxRef
      setData({
        ...data,
        width: target.current.clientWidth + 100,
        height: target.current.clientHeight >= document.body.clientHeight ? document.body.clientHeight : target.current.clientHeight + 100,
        opacity: 0,
        subOpacity: 0
      })
    }
  }, [boxState.active, boxState.sub])
  // 关闭盒子
  function closeBox() {
    setBoxState({
      ...boxState,
      active: 0
    })
    setData({
      opacity: 0,
      subOpacity: 0
    })
    setTimeout(() => {
      history.push('/')
    }, 300)
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
      scroll: coverRef.current.scrollTop,
      needCloseSub: 1
    })
    // 锁定一级，使其不跟随滚动条移动
    // console.log(-coverRef.current.scrollTop)
    // boxRef.current.parentNode.style.top = `-${777}px`
    // boxRef.current.parentNode.style.position = 'fixed'
    // setTimeout(() => {
    //   // 滚动条移至顶部
    //   coverRef.current.scrollTop = 0
    // }, 10)
    // setTimeout(() => {
    //   // 锁定一级，使其不跟随滚动条移动
    //   boxRef.current.parentNode.style.top = `-${coverRef.current.scrollTop}px`
    //   boxRef.current.parentNode.style.position = 'fixed'
    // }, 300)
  }
  // 关闭二级
  function closeSub() {
    if (!boxState.needCloseSub) {
      closeBox()
      subBoxRef.current.parentNode.style.top = `-${coverRef.current.scrollTop}px`
      subBoxRef.current.parentNode.style.position = 'fixed'
      boxRef.current.parentNode.style.top = 'inherit'
      boxRef.current.parentNode.style.position = 'absolute'
    } else {
      // 隐藏二级显示一级
      setBoxState({
        ...boxState,
        sub: 0,
        needCloseSub: 0
      })
      setTimeout(() => {
        flushCover()
        setData({
          ...data,
          opacity: 1,
          subOpacity: 0
        })
      }, 0)
      // 锁定二级，使其不跟随滚动条移动
      subBoxRef.current.parentNode.style.top = `-${coverRef.current.scrollTop}px`
      subBoxRef.current.parentNode.style.position = 'fixed'
      // 还原一级状态
      boxRef.current.parentNode.style.top = 'inherit'
      boxRef.current.parentNode.style.position = 'absolute'
      coverRef.current.scrollTop = boxState.scroll
      setTimeout(() => {
        history.goBack()
      }, 300)
    }
  }
  // 刷新背景
  function flushCover(target = '') {
    setTimeout(() => {
      const targetRef = target == 'sub' ? subBoxRef : boxRef
      setData({
        ...data,
        width: targetRef.current.clientWidth + 100,
        height: targetRef.current.clientHeight >= document.body.clientHeight ? document.body.clientHeight : targetRef.current.clientHeight + 100,
        opacity: target == 'sub' ? 0 : 1,
        subOpacity: target == 'sub' ? 1 : 0
      })
    }, 0)
  }
  // 监听URL
  useEffect(() => {
    const num = location.pathname.split('/').length
    if (location.pathname != '/' && num == 2) {
      // 一级
      setBoxState({
        ...boxState,
        active: 1,
        sub: 0
      })
    } else if (num == 3) {
      // 二级
      setBoxState({
        ...boxState,
        active: 1,
        sub: 1
      })
      setData({
        ...data,
        subOpacity: 0
      })
      // 还原二级状态
      subBoxRef.current.parentNode.style.top = 'inherit'
      subBoxRef.current.parentNode.style.position = 'absolute'
      // 锁定一级，使其不跟随滚动条移动
      boxRef.current.parentNode.style.top = `-${coverRef.current.scrollTop}px`
      boxRef.current.parentNode.style.position = 'fixed'
      // 恢复滚动条至顶部
      coverRef.current.scrollTop = 0
    } else {
      setBoxState({
        ...boxState,
        active: 0
      })
    }
  }, [location])
  return (
    <>
    <div className="cover-halftone" style={{opacity: boxState.active ? '0.7' : ''}}>
      <div className="cover-halftone-color" style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        background: boxState.active ? '#00ffff' : ''
      }}></div>
    </div>
    <div ref={e => {coverRef.current = e}} className={`${boxState.active ? 'cover-active' : ''} cover`}>
      <div
        onClick={() => {closeBox()}}
        className={`box-cover box-article ${boxState.sub ? 'hide-box' : ''}`}
        style={{
          transformOrigin: `${boxState.x}px ${boxState.y}px`,
          opacity: data.opacity
        }}
      >
        <div onClick={e => {e.stopPropagation()}} ref={e => {boxRef.current = e}} className="box pixel-top">
          <div className="box-content pixel-bottom">
            <Switch>
              <Route path="/article">
                <ArticleList sub={boxState.sub} openSub={openSub} flushCover={flushCover} />
              </Route>
              <Route path="/photo">
                <PhotoList sub={boxState.sub} openSub={openSub} flushCover={flushCover} />
              </Route>
              <Route path="/friend">
                <FriendList flushCover={flushCover} />
              </Route>
            </Switch>
          </div>
        </div>
        <div className="box pixel-top box-close">
          <div className="pixel-bottom">×</div>
        </div>
      </div>
      <div
        onClick={() => {closeSub()}}
        className={`box-cover box-article ${!boxState.sub ? 'hide-box' : ''}`}
        style={{
          position: 'fixed',
          transformOrigin: `${boxState.x}px ${boxState.y}px`,
          opacity: data.subOpacity
        }}
      >
        <div onClick={e => {e.stopPropagation()}} ref={e => {subBoxRef.current = e}} className="box pixel-top">
          <div className="box-content pixel-bottom">
            <Switch>
              <Route path="/article/:id">
                <Article flushCover={flushCover} />
              </Route>
              <Route path="/photo/:id">
                <Photo flushCover={flushCover} />
              </Route>
            </Switch>
          </div>
        </div>
        <div className="box pixel-top box-close">
          <div className="pixel-bottom">×</div>
        </div>
      </div>
    </div>
    </>
  )
}
function App() {
  const [gridList, setGridList] = useState([])
  const [boxState, setBoxState] = useState({})
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
      { class: 'tip' }
    ],
    blockRects: []
  })
  const blockRef = useRef([])
  const requestRef = useRef()
  const appRef = useRef()
  const [data, setData] = useState()
  const history = useHistory()
  const location = useLocation()
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
  function openCard(e, url) {
    if (!(state.current.change.x + state.current.change.y)) {
      if (url) {
        if (!url.indexOf('/')) {
          history.push(url)
          setBoxState({
            ...boxState,
            x: e.currentTarget.getClientRects()[0].x + e.currentTarget.clientWidth / 2,
            y: e.currentTarget.getClientRects()[0].y + e.currentTarget.clientHeight / 2
          })
        } else {
          window.open(url)
        }
      }
    }
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
  // 初始化
  useEffect(() => {
    const [height, width] = [36, 60]
    const grids = []
    const list = Array(height).fill(0).map(() => { return Array(width).fill(0) })
    // 第四个开始用于测试
    const defalutGrid = [
      [[15, 25], [5, 5]],
      [[15, 30], [2, 5]],
      [[17, 30], [3, 5]],
      [[20, 25], [1, 10]],
      // [[15, 35], [3, 5]]
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
    // 获取数据
    // fetch("http://localhost:7001/api/get")
    fetch("https://llxlife-server.llx.ink/api/get")
      .then(response => response.json())
      .then(result => {
        let i = 0
        for (let x = 0; x < height; x+=3) {
          for (let y = 0; y < width; y+=5) {
            // 排除默认
            let check = 1
            for (let i = x; i < x + 3; i++) {
              for (let j = y; j < y + 5; j++) {
                if (list[i] && list[i][j]) {
                  check = 0
                }
              }
            }
            if (check) {
              grids.push([`${x + 1} / ${y + 1} / ${x + 4} / ${y + 6}`])
              for (let i = x; i < x + 3; i++) {
                for (let j = y; j < y + 5; j++) {
                  if (list[i]) {
                    list[i][j] = 1
                  }
                }
              }
              // 添加数据
              if ((x == 0 || list[x-3] && list[x-3][y]) && Math.floor(Math.random() * 3) == 0) {
                state.current.blockInfo.push({ class: 'random-art' })
              } else {
                const apiType = ['哔哩哔哩', 'OSU', 'Nintendo Switch', '网易云音乐', '博文', '相册', 'PlayStation']
                const apiClass = ['bilibili', 'osu', 'switch', 'music', 'article-color', 'photo-color', 'psn']
                let cardClass = 'card '
                if (result[i]?.type) {
                  cardClass += apiClass[apiType.indexOf(result[i]?.type)]
                }
                state.current.blockInfo.push({ class: cardClass, data: result[i] })
                i++
              }
            }
          }
        }
        setGridList(grids)
        // 激活拖拽
        requestRef.current = requestAnimationFrame(render)
        return () => cancelAnimationFrame(requestRef.current)
      })
  }, [])

  // 恢复隐藏（打开动画）
  useEffect(() => {
    setTimeout(() => {
      if (gridList != '') {
        blockRef.current.forEach(dom => {
          dom.classList.remove('hide')
        })
      }
    }, 200)
  }, [gridList])
  // 记录方块边界
  useEffect(() => {
    setTimeout(() => {
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
    }, 1000)
  }, [gridList])
  // 计算边界
  useEffect(() => {
    const mainDOM = document.querySelector('.main')
    const body = document.body
    state.current.margin.x = - (body.clientWidth - mainDOM.clientWidth) / 2 + 20
    state.current.margin.y = - (body.clientHeight - mainDOM.clientHeight) / 2 + 60

    state.current.bodyRect.w = body.clientWidth
    state.current.bodyRect.h = body.clientHeight
    setTimeout(() => {
      document.body.style.pointerEvents = 'inherit'
    }, 1000)
  }, [])
  return (
    <>
    <Context.Provider value={{...data, state, boxState, setBoxState}}>
      <Grain/>
      <Flag/>
      <div onClick={() => {returnCenter()}} className="home">
        <img src="../img/home.svg" alt=""/>
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
              const data = state.current.blockInfo[index]?.data
              const url = state.current.blockInfo[index]?.data?.link
              return (
                <div
                  ref={e => {blockRef.current[index] = e}}
                  className={`${className ?? ''} block hide`}
                  style={{gridArea: item, transitionDelay: `${Math.floor(Math.random()*(200+1))}ms`}}
                  key={index}
                  onClick={e => {openCard(e, url)}}
                >
                  { className == 'logo' && <Logo openCard={openCard}/> }
                  { className == 'about' && <About/> }
                  { className == 'link' && <Link/> }
                  { className == 'tip' && <Tip/> }
                  { className.slice(0, 4) == 'card' && <Card data={data}/> }
                  { className == 'random-art' && <RandomArt/> }
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

export default withRouter(App)
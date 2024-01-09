import zfb from './assets/zfb.jpg'
import wx from './assets/wx.jpg'
export default function Footer() {
  return (
    <footer>
      <p>
        Developed by{' '}
        <a href="https://github.com/Wiiiiill" rel="noreferrer" target="_blank">
          github.com/Wiiiiill
        </a>
      </p>
      {false && <img src={zfb} style={{ width: '100%', height: '100%' }} />}
      {false && <img src={wx} style={{ width: '100%', height: '100%' }} />}
    </footer>
  )
}

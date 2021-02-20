/****************************************
* 
*   Simply Music
*   Copyright (C) 2021 JPlexer
*
*   This program is free software: you can redistribute it and/or modify
*   it under the terms of the GNU General Public License as published by
*   the Free Software Foundation, either version 3 of the License, or
*   (at your option) any later version.
*
*   This program is distributed in the hope that it will be useful,
*   but WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*   GNU General Public License for more details.
*
*   You should have received a copy of the GNU General Public License
*   along with this program.  If not, see <http://www.gnu.org/licenses/>.
* 
* *************************************/
const { app, BrowserWindow, Menu } = require('electron')
const client = require('discord-rich-presence')('767467554091565117');
//Menu.setApplicationMenu(false)
var localMusic = app.getPath('music');
global.iinfo = {
  musi: localMusic,
  title: 'Unknown Title',
  artist: 'Unknown Artist',
};


function createWindow () {
  const win = new BrowserWindow({
    
    width: 1200,
    height: 728,
    minHeight: 728,
    minWidth: 1200,
    icon: "./icons/sm1024.png",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

function setActivity() {
  client.updatePresence({
      state: global.iinfo.title,
      details: global.iinfo.artist,
      largeImageKey: 'sm2048',
  });
}

setActivity();

setInterval(() => {
    setActivity();
}, 1);
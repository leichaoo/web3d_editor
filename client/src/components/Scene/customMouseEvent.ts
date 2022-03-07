export interface MousePosition {
  x: number;
  y: number;
}

enum CUSTOM_MOUSE_EVENT {
  clickNoMove = 'clicknomove',
  move = 'move',
  drag = 'drag',
}

class CustomMouseEvent {
  cbs: Record<string, ((e: MouseEvent, ...rest: any[]) => void)[]> = {};
  public mousedown = false;
  constructor() {
    let mouseX = -1;
    let mouseY = -1;
    window.addEventListener('mousedown', (e) => {
      const cbs = this.cbs[CUSTOM_MOUSE_EVENT.clickNoMove];
      if (!cbs) return;
      mouseX = e.clientX;
      mouseY = e.clientY;
      this.mousedown = true;
    }, false);
    window.addEventListener('mousemove', (e) => {

      const cbs = this.cbs[CUSTOM_MOUSE_EVENT.move];

      if (!cbs) return;

      for (let cb of cbs) {

        cb(e);

      }

    }, false);
    window.addEventListener('mouseup', (e) => {
      if (this.mousedown && e.clientX === mouseX && e.clientY === mouseY) {
        const cbs = this.cbs[CUSTOM_MOUSE_EVENT.clickNoMove];
        if (!cbs) return;
        for (let cb of cbs) {
          cb(e);
        }
      } else if (this.mousedown) {
        const dragCbs = this.cbs[CUSTOM_MOUSE_EVENT.drag] || [];
        for (let cb of dragCbs) {
          cb(e, { x: mouseX, y: mouseY });
        }
      }
      this.mousedown = false;
      mouseX = -1;
      mouseY = -1;
    });
  }
  onKey(key: string, onKeyDownCb: (e: KeyboardEvent) => void, onKeyUpCb?: (e: KeyboardEvent) => void) {
    window.addEventListener('keydown', (e) => {
      if (e.key === key) {
        onKeyDownCb(e);
      }
    });
    if (onKeyUpCb) {
      window.addEventListener('keyup', (e) => {
        if (e.key === key) {
          onKeyUpCb(e);
        }
      });
    }
  }
  onMouseDown(cb: (e: MouseEvent) => void ) {
    window.addEventListener('mousedown', cb);
  }
  onMouseUp(cb: (e: MouseEvent) => void ) {
    window.addEventListener('mouseup', cb);
  }
  onMouseDrag(cb: (e: MouseEvent, startPos: MousePosition) => void) {
    if (this.cbs[CUSTOM_MOUSE_EVENT.drag]) {
      this.cbs[CUSTOM_MOUSE_EVENT.drag].push(cb);
    } else {
      this.cbs[CUSTOM_MOUSE_EVENT.drag] = [cb];
    }
  }
  offMouseDrag(cb: (e: MouseEvent, startPos: MousePosition) => void) {
    const cbList = this.cbs[CUSTOM_MOUSE_EVENT.drag];
    if (!cbList || !cbList.length) {
      return;
    }
    const index = cbList.findIndex(_cb => _cb === cb);
    if (index > -1) {
      cbList.splice(index, 1);
    }
  }
  onMousemove(cb: (e: MouseEvent) => void) {
    if (this.cbs[CUSTOM_MOUSE_EVENT.move]) {
      this.cbs[CUSTOM_MOUSE_EVENT.move].push(cb);
    } else {
      this.cbs[CUSTOM_MOUSE_EVENT.move] = [cb];
    }
  }
  offMousemove(cb: (e: MouseEvent) => void) {
    if (this.cbs[CUSTOM_MOUSE_EVENT.move]) {
      this.cbs[CUSTOM_MOUSE_EVENT.move].push(cb);
    } else {
      this.cbs[CUSTOM_MOUSE_EVENT.move] = [cb];
    }
  }
  onClickNoMove(cb: (e: MouseEvent) => void) {
    if (this.cbs[CUSTOM_MOUSE_EVENT.clickNoMove]) {
      this.cbs[CUSTOM_MOUSE_EVENT.clickNoMove].push(cb);
    } else {
      this.cbs[CUSTOM_MOUSE_EVENT.clickNoMove] = [cb];
    }
  }
  offClickNoMove(cb: (e: MouseEvent) => void) {
    const cbList = this.cbs[CUSTOM_MOUSE_EVENT.clickNoMove];
    if (!cbList || !cbList.length) {
      return;
    }
    const index = this.cbs[CUSTOM_MOUSE_EVENT.clickNoMove].findIndex(_cb => _cb === cb);
    if (index > -1) {
      this.cbs[CUSTOM_MOUSE_EVENT.clickNoMove].splice(index, 1);
    }
  }
}

export const customMouseEvent = new CustomMouseEvent();

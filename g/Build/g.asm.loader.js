function createUnityInstance(e, n, r) {
  function t(e, n, r) {
    if (l.startupErrorHandler) return void l.startupErrorHandler(e, n, r);
    if (!(l.errorHandler && l.errorHandler(e, n, r) || (console.log("Invoking error handler due to\n" + e), "function" == typeof dump && dump("Invoking error handler due to\n" + e), e.indexOf("UnknownError") != -1 || e.indexOf("Program terminated with exit(0)") != -1 || t.didShowErrorMessage))) {
      var e = "An error occurred running the Unity content on this page. See your browser JavaScript console for more info. The error was:\n" + e;
      e.indexOf("DISABLE_EXCEPTION_CATCHING") != -1 ? e = "An exception has occurred, but exception handling has been disabled in this build. If you are the developer of this content, enable exceptions in your project WebGL player settings to be able to catch the exception or see the stack trace." : e.indexOf("Cannot enlarge memory arrays") != -1 ? e = "Out of memory. If you are the developer of this content, try allocating more memory to your WebGL build in the WebGL player settings." : e.indexOf("Invalid array buffer length") == -1 && e.indexOf("Invalid typed array length") == -1 && e.indexOf("out of memory") == -1 && e.indexOf("could not allocate memory") == -1 || (e = "The browser could not allocate enough memory for the WebGL content. If you are the developer of this content, try allocating less memory to your WebGL build in the WebGL player settings."), alert(e), t.didShowErrorMessage = !0
    }
  }

  function o(e) {
    var n = "unhandledrejection" == e.type && "object" == typeof e.reason ? e.reason : "object" == typeof e.error ? e.error : null,
      r = n ? n.toString() : "string" == typeof e.message ? e.message : "string" == typeof e.reason ? e.reason : "";
    if (n && "string" == typeof n.stack && (r += "\n" + n.stack.substring(n.stack.lastIndexOf(r, 0) ? 0 : r.length).replace(/(^\n*|\n*$)/g, "")), r && l.stackTraceRegExp && l.stackTraceRegExp.test(r)) {
      var o = e instanceof ErrorEvent ? e.filename : n && "string" == typeof n.fileName ? n.fileName : n && "string" == typeof n.sourceURL ? n.sourceURL : "",
        i = e instanceof ErrorEvent ? e.lineno : n && "number" == typeof n.lineNumber ? n.lineNumber : n && "number" == typeof n.line ? n.line : 0;
      t(r, o, i)
    }
  }

  function i(e, n) {
    if ("symbolsUrl" != e) {
      var t = l.downloadProgress[e];
      t || (t = l.downloadProgress[e] = {
        started: !1,
        finished: !1,
        lengthComputable: !1,
        total: 0,
        loaded: 0
      }), "object" != typeof n || "progress" != n.type && "load" != n.type || (t.started || (t.started = !0, t.lengthComputable = n.lengthComputable, t.total = n.total), t.loaded = n.loaded, "load" == n.type && (t.finished = !0));
      var o = 0, i = 0, s = 0, a = 0, d = 0;
      for (var e in l.downloadProgress) {
        var t = l.downloadProgress[e];
        if (!t.started) return 0;
        s++, t.lengthComputable ? (o += t.loaded, i += t.total, a++) : t.finished || d++
      }
      var u = s ? (s - d - (i ? a * (i - o) / i : 0)) / s : 0;
      r(.9 * u)
    }
  }

  function s(e) {
    return new Promise(function (n, r) {
      i(e);
      var t = new XMLHttpRequest;
      t.open("GET", l[e]), t.responseType = "arraybuffer", t.addEventListener("progress", function (n) {
        i(e, n)
      }), t.addEventListener("load", function (r) {
        i(e, r), n(new Uint8Array(t.response))
      }), t.send()
    })
  }

  function a() {
    return new Promise(function (e, n) {
      var r = document.createElement("script");
      r.src = l.frameworkUrl, r.onload = function () {
        delete r.onload, e(unityFramework)
      }, document.body.appendChild(r), l.deinitializers.push(function () {
        document.body.removeChild(r)
      })
    })
  }

  function d() {
    return new Promise(function (e, n) {
      var r = document.createElement("script");
      r.src = l.codeUrl, r.onload = function () {
        delete r.onload, e()
      }, document.body.appendChild(r), l.deinitializers.push(function () {
        document.body.removeChild(r)
      })
    })
  }

  function u() {
    Promise.all([a(), d()]).then(function (e) {
      e[0](l)
    }), l.memoryInitializerRequest = {
      addEventListener: function (e, n) {
        "load" == e && (l.memoryInitializerRequest.useRequest = n)
      }
    }, s("memoryUrl").then(function (e) {
      l.memoryInitializerRequest.status = 200, l.memoryInitializerRequest.response = e, l.memoryInitializerRequest.useRequest && l.memoryInitializerRequest.useRequest()
    });
    var e = s("dataUrl");
    l.preRun.push(function () {
      l.addRunDependency("dataUrl"), e.then(function (e) {
        var n = new DataView(e.buffer, e.byteOffset, e.byteLength), r = 0, t = "UnityWebData1.0\0";
        if (!String.fromCharCode.apply(null, e.subarray(r, r + t.length)) == t) throw"unknown data format";
        r += t.length;
        var o = n.getUint32(r, !0);
        for (r += 4; r < o;) {
          var i = n.getUint32(r, !0);
          r += 4;
          var s = n.getUint32(r, !0);
          r += 4;
          var a = n.getUint32(r, !0);
          r += 4;
          var d = String.fromCharCode.apply(null, e.subarray(r, r + a));
          r += a;
          for (var u = 0, c = d.indexOf("/", u) + 1; c > 0; u = c, c = d.indexOf("/", u) + 1) l.FS_createPath(d.substring(0, u), d.substring(u, c - 1), !0, !0);
          l.FS_createDataFile(d, null, e.subarray(i, i + s), !0, !0, !0)
        }
        l.removeRunDependency("dataUrl")
      })
    })
  }

  r = r || function () {
  };
  var l = {
    canvas: e,
    webglContextAttributes: {preserveDrawingBuffer: !1},
    TOTAL_MEMORY: 268435456,
    streamingAssetsUrl: "StreamingAssets",
    downloadProgress: {},
    deinitializers: [],
    intervals: {},
    setInterval: function (e, n) {
      var r = window.setInterval(e, n);
      return this.intervals[r] = !0, r
    },
    clearInterval: function (e) {
      delete this.intervals[e], window.clearInterval(e)
    },
    preRun: [],
    postRun: [],
    print: function (e) {
      console.log(e)
    },
    printErr: function (e) {
      console.error(e)
    },
    locateFile: function (e) {
      return e
    },
    disabledCanvasEvents: ["contextmenu", "dragstart"]
  };
  for (var c in n) l[c] = n[c];
  l.streamingAssetsUrl = new URL(l.streamingAssetsUrl, document.URL).href, l.disabledCanvasEvents.forEach(function (n) {
    e.addEventListener(n, function (e) {
      e.preventDefault()
    })
  });
  var f = {
    Module: l, SetFullscreen: function () {
      return l.SetFullscreen ? l.SetFullscreen.apply(l, arguments) : void l.print("Failed to set Fullscreen mode: Player not loaded yet.")
    }, SendMessage: function () {
      return l.SendMessage ? l.SendMessage.apply(l, arguments) : void l.print("Failed to execute SendMessage: Player not loaded yet.")
    }, Quit: function () {
      return new Promise(function (e, n) {
        l.shouldQuit = !0, l.onQuit = e
      })
    }
  };
  return l.SystemInfo = function () {
    var e, n, r, t = "-", o = navigator.appVersion, i = navigator.userAgent, s = navigator.appName,
      a = navigator.appVersion, d = parseInt(navigator.appVersion, 10);
    (n = i.indexOf("Opera")) != -1 ? (s = "Opera", a = i.substring(n + 6), (n = i.indexOf("Version")) != -1 && (a = i.substring(n + 8))) : (n = i.indexOf("MSIE")) != -1 ? (s = "Microsoft Internet Explorer", a = i.substring(n + 5)) : (n = i.indexOf("Edge")) != -1 ? (s = "Edge", a = i.substring(n + 5)) : (n = i.indexOf("Chrome")) != -1 ? (s = "Chrome", a = i.substring(n + 7)) : (n = i.indexOf("Safari")) != -1 ? (s = "Safari", a = i.substring(n + 7), (n = i.indexOf("Version")) != -1 && (a = i.substring(n + 8))) : (n = i.indexOf("Firefox")) != -1 ? (s = "Firefox", a = i.substring(n + 8)) : i.indexOf("Trident/") != -1 ? (s = "Microsoft Internet Explorer", a = i.substring(i.indexOf("rv:") + 3)) : (e = i.lastIndexOf(" ") + 1) < (n = i.lastIndexOf("/")) && (s = i.substring(e, n), a = i.substring(n + 1), s.toLowerCase() == s.toUpperCase() && (s = navigator.appName)), (r = a.indexOf(";")) != -1 && (a = a.substring(0, r)), (r = a.indexOf(" ")) != -1 && (a = a.substring(0, r)), (r = a.indexOf(")")) != -1 && (a = a.substring(0, r)), d = parseInt("" + a, 10), isNaN(d) ? (a = "" + parseFloat(navigator.appVersion), d = parseInt(navigator.appVersion, 10)) : a = "" + parseFloat(a);
    var u = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(o), l = t,
      c = [{s: "Windows 3.11", r: /Win16/}, {s: "Windows 95", r: /(Windows 95|Win95|Windows_95)/}, {
        s: "Windows ME",
        r: /(Win 9x 4.90|Windows ME)/
      }, {s: "Windows 98", r: /(Windows 98|Win98)/}, {s: "Windows CE", r: /Windows CE/}, {
        s: "Windows 2000",
        r: /(Windows NT 5.0|Windows 2000)/
      }, {s: "Windows XP", r: /(Windows NT 5.1|Windows XP)/}, {
        s: "Windows Server 2003",
        r: /Windows NT 5.2/
      }, {s: "Windows Vista", r: /Windows NT 6.0/}, {
        s: "Windows 7",
        r: /(Windows 7|Windows NT 6.1)/
      }, {s: "Windows 8.1", r: /(Windows 8.1|Windows NT 6.3)/}, {
        s: "Windows 8",
        r: /(Windows 8|Windows NT 6.2)/
      }, {s: "Windows 10", r: /(Windows 10|Windows NT 10.0)/}, {
        s: "Windows NT 4.0",
        r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
      }, {s: "Windows ME", r: /Windows ME/}, {s: "Android", r: /Android/}, {s: "Open BSD", r: /OpenBSD/}, {
        s: "Sun OS",
        r: /SunOS/
      }, {s: "Linux", r: /(Linux|X11)/}, {s: "iOS", r: /(iPhone|iPad|iPod)/}, {
        s: "Mac OS X",
        r: /Mac OS X/
      }, {s: "Mac OS", r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/}, {s: "QNX", r: /QNX/}, {
        s: "UNIX",
        r: /UNIX/
      }, {s: "BeOS", r: /BeOS/}, {s: "OS/2", r: /OS\/2/}, {
        s: "Search Bot",
        r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
      }];
    for (var f in c) {
      var p = c[f];
      if (p.r.test(i)) {
        l = p.s;
        break
      }
    }
    var m = t;
    switch (/Windows/.test(l) && (m = /Windows (.*)/.exec(l)[1], l = "Windows"), l) {
      case"Mac OS X":
        m = /Mac OS X (10[\.\_\d]+)/.exec(i)[1];
        break;
      case"Android":
        m = /Android ([\.\_\d]+)/.exec(i)[1];
        break;
      case"iOS":
        m = /OS (\d+)_(\d+)_?(\d+)?/.exec(o), m = m[1] + "." + m[2] + "." + (0 | m[3])
    }
    return {
      width: screen.width ? screen.width : 0,
      height: screen.height ? screen.height : 0,
      browser: s,
      browserVersion: a,
      mobile: u,
      os: l,
      osVersion: m,
      gpu: function () {
        var e = document.createElement("canvas"), n = e.getContext("experimental-webgl");
        if (n) {
          var r = n.getExtension("WEBGL_debug_renderer_info");
          if (r) return n.getParameter(r.UNMASKED_RENDERER_WEBGL)
        }
        return t
      }(),
      language: window.navigator.userLanguage || window.navigator.language,
      hasWebGL: function () {
        if (!window.WebGLRenderingContext) return 0;
        var e = document.createElement("canvas"), n = e.getContext("webgl2");
        return n ? 2 : (n = e.getContext("experimental-webgl2"), n ? 2 : (n = e.getContext("webgl"), n || (n = e.getContext("experimental-webgl")) ? 1 : 0))
      }(),
      hasCursorLock: function () {
        var e = document.createElement("canvas");
        return e.requestPointerLock || e.mozRequestPointerLock || e.webkitRequestPointerLock || e.msRequestPointerLock ? 1 : 0
      }(),
      hasFullscreen: function () {
        var e = document.createElement("canvas");
        return (e.requestFullScreen || e.mozRequestFullScreen || e.msRequestFullscreen || e.webkitRequestFullScreen) && (s.indexOf("Safari") == -1 || a >= 10.1) ? 1 : 0
      }(),
      hasThreads: "undefined" != typeof SharedArrayBuffer,
      hasWasm: "object" == typeof WebAssembly && "function" == typeof WebAssembly.validate && "function" == typeof WebAssembly.compile,
      hasWasmThreads: function () {
        if ("object" != typeof WebAssembly) return !1;
        if ("undefined" == typeof SharedArrayBuffer) return !1;
        var e = new WebAssembly.Memory({initial: 1, maximum: 1, shared: !0}), n = e.buffer instanceof SharedArrayBuffer;
        return delete e, n
      }()
    }
  }(), l.abortHandler = function (e) {
    return t(e, "", 0), !0
  }, window.addEventListener("error", o), window.addEventListener("unhandledrejection", o), Error.stackTraceLimit = Math.max(Error.stackTraceLimit || 0, 50), new Promise(function (e, n) {
    l.SystemInfo.hasWebGL ? (1 == l.SystemInfo.hasWebGL && l.print('Warning: Your browser does not support "WebGL 2.0" Graphics API, switching to "WebGL 1.0"'), l.startupErrorHandler = n, r(0), l.postRun.push(function () {
      r(1), delete l.startupErrorHandler, e(f)
    }), u()) : n("Your browser does not support WebGL.")
  })
}

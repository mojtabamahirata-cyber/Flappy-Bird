/*************************************************************
***** نسخة زرزور: كود السكور بدل Telegram.sendData ***********
*************************************************************/
// بعد ما تخسر يطلع أمر جاهز: /سكور <الكود> — تنسخه وتلصقه بروم زرزور،
// والبوت يسجّل السكور وينشر التصنيف بنفس الروم.
(function () {
    const SALT = 'zrzur-flappy-v1' // لازم يطابق FLAPPY_SALT بالبوت

    function fnv1a(str) {
        let h = 0x811c9dc5
        for (let i = 0; i < str.length; i++) {
            h ^= str.charCodeAt(i)
            h = Math.imul(h, 0x01000193) >>> 0
        }
        return h.toString(16).padStart(8, '0')
    }

    function getSession() {
        try {
            const encoded = new URLSearchParams(window.location.search).get('d')
            if (!encoded) return null
            let b64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
            while (b64.length % 4) b64 += '='
            return JSON.parse(decodeURIComponent(escape(window.atob(b64))))
        } catch (e) {
            return null
        }
    }

    const session = getSession()
    const screen = document.querySelector('.game-screen') || document.body

    const box = document.createElement('div')
    box.style.cssText = 'display:none;direction:rtl;text-align:center;margin:10px auto 0;padding:10px 12px;' +
        'max-width:300px;background:#1b1f2a;color:#fff;border-radius:12px;font:14px/1.6 sans-serif;'
    const title = document.createElement('div')
    const input = document.createElement('input')
    input.readOnly = true
    input.style.cssText = 'width:100%;box-sizing:border-box;margin:6px 0;padding:8px;border-radius:8px;' +
        'border:1px solid #3a4054;background:#0f121a;color:#fff;direction:ltr;text-align:center;font:13px monospace;'
    const btn = document.createElement('button')
    btn.textContent = '📋 نسخ الأمر'
    btn.style.cssText = 'padding:8px 14px;border:0;border-radius:8px;background:#4c7dff;color:#fff;font:14px sans-serif;'
    const hint = document.createElement('div')
    hint.style.cssText = 'font-size:12px;opacity:.8;margin-top:6px;'
    hint.textContent = 'الصق الأمر بروم زرزور وبعدها يطلع التصنيف'
    box.append(title, input, btn, hint)
    screen.appendChild(box)

    btn.addEventListener('click', function (e) {
        e.stopPropagation()
        input.focus()
        input.select()
        input.setSelectionRange(0, input.value.length)
        let ok = false
        try { ok = document.execCommand('copy') } catch (err) {}
        if (!ok && navigator.clipboard) {
            navigator.clipboard.writeText(input.value).then(function () { btn.textContent = '✅ اننسخ' })
        } else {
            btn.textContent = ok ? '✅ اننسخ' : 'ظلّل الأمر وانسخه'
        }
    })

    let shownFor = null
    setInterval(function () {
        if (typeof gameState === 'undefined' || typeof score === 'undefined') return
        if (gameState.current === gameState.gameOver) {
            if (shownFor === null) {
                shownFor = score.current
                title.textContent = '🐦 سكورك: ' + shownFor
                if (session && session.token) {
                    const s = String(shownFor)
                    const code = s + '.' + session.token + '.' + fnv1a(s + '|' + session.token + '|' + SALT)
                    input.value = '/سكور ' + code
                    input.style.display = ''
                    btn.style.display = ''
                    hint.style.display = ''
                    btn.textContent = '📋 نسخ الأمر'
                } else {
                    input.style.display = 'none'
                    btn.style.display = 'none'
                    hint.textContent = 'افتح اللعبة من الرابط اللي يرسله البوت (اكتب: فلابي بيرد) حتى ينحسب سكورك'
                }
                box.style.display = 'block'
            }
        } else if (shownFor !== null) {
            shownFor = null
            box.style.display = 'none'
        }
    }, 200)
})()

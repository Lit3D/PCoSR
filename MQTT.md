**Глобально переход в заставку (картинка + призывы)**
"/lit3d/master/scenario": {}

**Запуск пака (led + wave)**
"/lit3d/master/visual": { "id": "main | pack_1 | ...", "lang": "ru | en" }

**Запуск сценария**
"/lit3d/master/scenario": { "id": "main | ..." }

**Переход в заставку на главном экране**
"/lit3d/slave/led/splash": {}

**Отраслевой ролик на главном экране**
"/lit3d/slave/led/ss": { "id": "1 | 2 | ..." }

**Видео на главном экране**
"/lit3d/slave/led/video": { "src": "video path" }

**Картинка на главном экране**
"/lit3d/slave/led/image": { "src": "image path" } - установить картинку
"/lit3d/slave/led/image": { } - сбросит в дефолт

**Презентация на главном экране**
"/lit3d/slave/led/webcam": { **TODO** }

**Фоновая музыка в зале, через плеер на главном экране**
"/lit3d/slave/led/music": { src: ["mp3 url", "mp3 url"] | "mp3 url" } - включить
"/lit3d/slave/led/music": { } - выключить

**Установка громкости видео на главном экране**
"/lit3d/slave/led/volume/set": "0..100"

**Установка громкости фоновой музыки на главном экране**
"/lit3d/slave/led/music/volume/set": "0..100"

**Переход в заставку на всех мониторах (призывы)**
"/lit3d/slave/line/splash": {}

**Режим камер глубины**
"/lit3d/slave/line/realsense/enabled": "1 | 0"

**Активация отраслевого ролика**
"/lit3d/slave/line/1..12/ss": { "id": "1 | 2 | ...", "muted": true }

**Управление доступом к экспонатам**
"/lit3d/master/exhibits": { "allow" : "true | false" }

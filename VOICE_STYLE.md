# 嵐星配音試聽草案

目前三版僅供選擇，尚未套用到完整七步驟示範。

共同台詞：嗨，大家好！我是嵐星！今天，我們要一起做珍珠紅茶拿鐵。準備好了嗎？拿起紙杯，加入兩湯匙珍珠，再量一百五十毫升牛奶。一起動手吧！

三種合成聲線取自本機語音模型 vits-zh-hf-fanchen-C，使用 sherpa-onnx 1.13.8，speaker ID 分別為0、3、5，speed=1.08。配音方向：A明亮小精靈、B軟萌小夥伴、C元氣小隊長。人物聲線名稱為本專案草案標籤，非配音員姓名。

來源模型：https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-zh-hf-fanchen-C.tar.bz2

模型下載校驗為發布檔案MD5（base64）：JinsgZfU0sVg4lllF6GYgA==。

輸出：assets/voice/voice-{a,b,c}.mp3為配樂版，voice-{a,b,c}-clean.mp3為純人聲。頁面voice-audition.html可直接播放比較，每次只播放一個音檔。

音樂為本次自行編排的112 BPM短旋律：柔和撥弦音色、小節低音與輕節奏；三版使用同一個音樂素材，混音時人聲優先。未取用商業歌曲。

若使用者選定音色，才將完整七步驟台詞重新生成，並依人聲時長安排畫格，不能把此段試聽台詞重複播放充當完整教學。

無人聲音樂底檔：assets/voice/music-bed.mp3，可供選定聲線後製作完整示範時沿用。

第二輪：使用者認為第一輪太成熟，新增voice-cute.html。以原始不同聲線做卡通化音高／語速處理：A speaker0 pitch1.24 tempo.87；B speaker3 pitch1.16 tempo.89；C speaker5 pitch1.32 tempo.84。非特定卡通人物模仿。音檔為assets/voice/cute-*.mp3，仍待使用者挑選。

第三輪：使用者選C但覺得太尖，製作C圓潤版（尚待確認）：speaker5，pitch1.20，tempo.90，350Hz +2dB、3200Hz -3dB、6500Hz低通；相同配樂。檔案cute-c-round*.mp3，頁面voice-c-round.html。

第四輪：使用者希望背景音樂更活潑、快樂。保留C圓潤人聲，新增原創132 BPM大調跳躍旋律、彈跳低音、反拍撥弦和輕打擊樂；配樂檔music-happy.mp3，混音cute-c-round-happy.mp3，使用側鏈在人聲時輕壓配樂音量。voice-c-round.html更新為此版，仍待確認與套入完整示範。

// https://igliu.com/word2vec-json/
// http://turbomaze.github.io/word2vecjson/
// http://harrisosserman.com/post/word2vec-in-javascript
var j6 = require('../../lib/j6')
var fs = require('fs')
let W = module.exports = {
  wordMap: {},
  wordId: {},
  wordTop: 0
}

W.word2map = function (file) {
  W.wordMap = {}
  let text = fs.readFileSync(file, 'utf-8')
  let lines = text.split(/\r?\n/)
  for (let line of lines) {
    if (line.trim() !== '') W.doLine(line)
  }
}

W.doLine = function (line) {
  line = '^' + line + '$'
  let len = line.length
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      W.neighbor(line[i], line[j])
    }
  }
}

W.getWord = function (w) {
  if (W.wordMap[w] == null) W.wordMap[w] = {}
  return W.wordMap[w]
}

W.neighbor = function (w1, w2) {
  let w1map = W.getWord(w1)
  w1map[w2] = (w1map[w2] == null) ? 1 : w1map[w2] + 1
}

W.map2matrix = function (wordMap) {
  W.wordTop = 0
  W.wordId = {}
  for (let w in wordMap) {
    if (W.wordId[w] == null) W.wordId[w] = W.wordTop++
  }
  var m = j6.M.new(W.wordTop, W.wordTop)
  for (let w1 in wordMap) {
    let id1 = W.wordId[w1]
    for (let w2 in wordMap[w1]) {
      let id2 = W.wordId[w2]
      m[id1][id2] = W.wordMap[w1][w2]
    }
  }
  return m
}

W.matrix2similarity = function (m) {
  let s = []
  for (let i = 0; i < m.rows(); i++) {
    s[i] = []
    for (let j = 0; j < m.rows(); j++) {
      s[i][j] = j6.cosineSimilarity(m[i], m[j])
    }
  }
  return s
}

W.word2map('word.10000.bak')
console.log('%s', JSON.stringify(W.wordMap, null, 2))
var m = W.map2matrix(W.wordMap)
console.log('%s', m.mstr())
console.log('%j', W.wordId)
var s = W.matrix2similarity(m)
console.log('%s', s.mstr())

/*
def train(vocab_dict, vocab_freq_dict, table):
    total_words = sum([x[1] for x in vocab_freq_dict.items()])
    vocab_size = len(vocab_dict)

    # 參數設定
    layer1_size = 30 # hidden layer 的大小，即向量大小
    window = 2 # 上下文寬度的上限
    alpha_init = 0.025 # learning rate
    sample = 0.001 # 用來隨機丟棄高頻字用
    negative = 10 # negative sampling 的數量
    ite = 2 # iteration 次數

    # Weights 初始化
    # syn0 : input layer 到 hidden layer 之間的 weights ，用隨機值初始化
    # syn1 : hidden layer 到 output layer 之間的 weights ，用0初始化
    syn0 = (0.5 - np.random.rand(vocab_size, layer1_size)) / layer1_size
    syn1 = np.zeros((layer1_size, vocab_size))

    # 印出進度用
    train_words = 0 # 總共訓練了幾個字
    p_count = 0
    avg_err = 0.
    err_count = 0

    for local_iter in range(ite):
        print "local_iter", local_iter
        f = open("poem.txt")
        for line in f.readlines():

            #用來暫存要訓練的字，一次訓練一個句子
            sen = []

            # 取出要被訓練的字
            for word_raw in line.decode("utf-8").strip().split():
                last_word = vocab_dict.get(word_raw, -1)

                # 丟棄字典中沒有的字（頻率太低）
                if last_word == -1:
                    continue
                cn = vocab_freq_dict.get(word_raw)
                ran = (math.sqrt(cn / float(sample * total_words + 1))) * (sample * total_words) / cn

                # 根據字的頻率，隨機丟棄，頻率越高的字，越有機會被丟棄
                if ran < random.random():
                    continue
                train_words += 1

                # 將要被訓練的字加到 sen
                sen.append(last_word)

            # 根據訓練過的字數，調整 learning rate
            alpha = alpha_init * (1 - train_words / float(ite * total_words + 1))
            if alpha < alpha_init * 0.0001:
                alpha = alpha_init * 0.0001

            # 逐一訓練 sen 中的字
            for a, word in enumerate(sen):

            		# 隨機調整 window 大小
                b = random.randint(1, window)
                for c in range(a - b, a + b + 1):

                    # input 為 window 範圍中，上下文的某一字
                    if c < 0 or c == a or c >= len(sen):
                        continue
                    last_word = sen[c]
										
                    # h_err 暫存 hidden layer 的 error 用
                    h_err = np.zeros((layer1_size))

                    # 進行 negative sampling
                    for negcount in range(negative):

                    		# positive example，從 sen 中取得，模型要輸出 1
                        if negcount == 0:
                            target_word = word
                            label = 1

                        # negative example，從 table 中抽樣，模型要輸出 0 
                        else:
                            while True:
                                target_word = table[random.randint(0, len(table) - 1)]
                                if target_word not in sen:
                                    break
                            label = 0

                        # 模型預測結果
                        o_pred = 1 / (1 + np.exp(- np.dot(syn0[last_word, :], syn1[:, target_word])))

                        # 預測結果和標準答案的差距
                        o_err = o_pred - label

                        # backward propagation
                        # 此部分請參照 word2vec part2 的公式推導結果

                        # 1.將 error 傳遞到 hidden layer                        
                        h_err += o_err * syn1[:, target_word]

                        # 2.更新 syn1
                        syn1[:, target_word] -= alpha * o_err * syn0[last_word]
                        avg_err += abs(o_err)
                        err_count += 1

                    # 3.更新 syn0
                    syn0[last_word, :] -= alpha * h_err

                    # 印出目前結果
                    p_count += 1
                    if p_count % 10000 == 0:
                        print "Iter: %s, Alpha %s, Train Words %s, Average Error: %s" \
                              % (local_iter, alpha, 100 * train_words, avg_err / float(err_count))
                        avg_err = 0.
                        err_count == 0.

        # 每一個 iteration 儲存一次訓練完的模型
        model_name = "w2v_model_blog_%s.json" % (local_iter)
        print "save model: %s" % (model_name)
        fm = open(model_name, "w")
        fm.write(json.dumps(syn0.tolist(), indent=4))
        fm.close()
*/

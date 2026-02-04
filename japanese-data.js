// Japanese Learning Data
// Comprehensive data for learning Japanese with spaced repetition

const japaneseData = {
    hiragana: [
        // Basic Hiragana (ordered by frequency)
        { char: 'の', romaji: 'no', meaning: 'hiragana "no"', frequency: 1, example: 'Most common particle' },
        { char: 'に', romaji: 'ni', meaning: 'hiragana "ni"', frequency: 2, example: 'Common particle' },
        { char: 'は', romaji: 'ha/wa', meaning: 'hiragana "ha/wa"', frequency: 3, example: 'Topic particle' },
        { char: 'を', romaji: 'wo/o', meaning: 'hiragana "wo"', frequency: 4, example: 'Object particle' },
        { char: 'た', romaji: 'ta', meaning: 'hiragana "ta"', frequency: 5, example: 'Common character' },
        { char: 'と', romaji: 'to', meaning: 'hiragana "to"', frequency: 6, example: 'And, with' },
        { char: 'が', romaji: 'ga', meaning: 'hiragana "ga"', frequency: 7, example: 'Subject particle' },
        { char: 'で', romaji: 'de', meaning: 'hiragana "de"', frequency: 8, example: 'At, by means of' },
        { char: 'て', romaji: 'te', meaning: 'hiragana "te"', frequency: 9, example: 'Te-form connector' },
        { char: 'い', romaji: 'i', meaning: 'hiragana "i"', frequency: 10, example: 'Vowel i' },

        // A-row
        { char: 'あ', romaji: 'a', meaning: 'hiragana "a"', frequency: 11, example: 'Vowel a' },
        { char: 'う', romaji: 'u', meaning: 'hiragana "u"', frequency: 12, example: 'Vowel u' },
        { char: 'え', romaji: 'e', meaning: 'hiragana "e"', frequency: 13, example: 'Vowel e' },
        { char: 'お', romaji: 'o', meaning: 'hiragana "o"', frequency: 14, example: 'Vowel o' },

        // K-row
        { char: 'か', romaji: 'ka', meaning: 'hiragana "ka"', frequency: 15, example: 'Question particle' },
        { char: 'き', romaji: 'ki', meaning: 'hiragana "ki"', frequency: 16, example: 'Common character' },
        { char: 'く', romaji: 'ku', meaning: 'hiragana "ku"', frequency: 17, example: 'Common character' },
        { char: 'け', romaji: 'ke', meaning: 'hiragana "ke"', frequency: 18, example: 'Common character' },
        { char: 'こ', romaji: 'ko', meaning: 'hiragana "ko"', frequency: 19, example: 'This' },

        // S-row
        { char: 'さ', romaji: 'sa', meaning: 'hiragana "sa"', frequency: 20, example: 'Common character' },
        { char: 'し', romaji: 'shi', meaning: 'hiragana "shi"', frequency: 21, example: 'Common character' },
        { char: 'す', romaji: 'su', meaning: 'hiragana "su"', frequency: 22, example: 'To do' },
        { char: 'せ', romaji: 'se', meaning: 'hiragana "se"', frequency: 23, example: 'Common character' },
        { char: 'そ', romaji: 'so', meaning: 'hiragana "so"', frequency: 24, example: 'That' },

        // T-row
        { char: 'ち', romaji: 'chi', meaning: 'hiragana "chi"', frequency: 25, example: 'Common character' },
        { char: 'つ', romaji: 'tsu', meaning: 'hiragana "tsu"', frequency: 26, example: 'Common character' },
        { char: 'な', romaji: 'na', meaning: 'hiragana "na"', frequency: 27, example: 'Common character' },
        { char: 'ね', romaji: 'ne', meaning: 'hiragana "ne"', frequency: 28, example: 'Sentence ender' },

        // N-row
        { char: 'ん', romaji: 'n', meaning: 'hiragana "n"', frequency: 29, example: 'Nasal n' },

        // H-row
        { char: 'ひ', romaji: 'hi', meaning: 'hiragana "hi"', frequency: 30, example: 'Fire, sun' },
        { char: 'ふ', romaji: 'fu', meaning: 'hiragana "fu"', frequency: 31, example: 'Common character' },
        { char: 'へ', romaji: 'he/e', meaning: 'hiragana "he"', frequency: 32, example: 'Direction particle' },
        { char: 'ほ', romaji: 'ho', meaning: 'hiragana "ho"', frequency: 33, example: 'Common character' },

        // M-row
        { char: 'ま', romaji: 'ma', meaning: 'hiragana "ma"', frequency: 34, example: 'Common character' },
        { char: 'み', romaji: 'mi', meaning: 'hiragana "mi"', frequency: 35, example: 'To see' },
        { char: 'む', romaji: 'mu', meaning: 'hiragana "mu"', frequency: 36, example: 'Common character' },
        { char: 'め', romaji: 'me', meaning: 'hiragana "me"', frequency: 37, example: 'Eye' },
        { char: 'も', romaji: 'mo', meaning: 'hiragana "mo"', frequency: 38, example: 'Also' },

        // Y-row
        { char: 'や', romaji: 'ya', meaning: 'hiragana "ya"', frequency: 39, example: 'Common character' },
        { char: 'ゆ', romaji: 'yu', meaning: 'hiragana "yu"', frequency: 40, example: 'Hot water' },
        { char: 'よ', romaji: 'yo', meaning: 'hiragana "yo"', frequency: 41, example: 'Sentence ender' },

        // R-row
        { char: 'ら', romaji: 'ra', meaning: 'hiragana "ra"', frequency: 42, example: 'Common character' },
        { char: 'り', romaji: 'ri', meaning: 'hiragana "ri"', frequency: 43, example: 'Reason, logic' },
        { char: 'る', romaji: 'ru', meaning: 'hiragana "ru"', frequency: 44, example: 'Verb ending' },
        { char: 'れ', romaji: 're', meaning: 'hiragana "re"', frequency: 45, example: 'Common character' },
        { char: 'ろ', romaji: 'ro', meaning: 'hiragana "ro"', frequency: 46, example: 'Common character' },

        // W-row
        { char: 'わ', romaji: 'wa', meaning: 'hiragana "wa"', frequency: 47, example: 'Topic particle (written は)' }
    ],

    katakana: [
        // Basic Katakana (ordered by frequency)
        { char: 'ー', romaji: '-', meaning: 'katakana long vowel mark', frequency: 1, example: 'Lengthens vowels' },
        { char: 'ル', romaji: 'ru', meaning: 'katakana "ru"', frequency: 2, example: 'Common in foreign words' },
        { char: 'ン', romaji: 'n', meaning: 'katakana "n"', frequency: 3, example: 'Nasal n' },
        { char: 'ト', romaji: 'to', meaning: 'katakana "to"', frequency: 4, example: 'Common character' },
        { char: 'リ', romaji: 'ri', meaning: 'katakana "ri"', frequency: 5, example: 'Common character' },
        { char: 'ス', romaji: 'su', meaning: 'katakana "su"', frequency: 6, example: 'Common character' },
        { char: 'ク', romaji: 'ku', meaning: 'katakana "ku"', frequency: 7, example: 'Common character' },
        { char: 'テ', romaji: 'te', meaning: 'katakana "te"', frequency: 8, example: 'Common character' },
        { char: 'イ', romaji: 'i', meaning: 'katakana "i"', frequency: 9, example: 'Vowel i' },
        { char: 'シ', romaji: 'shi', meaning: 'katakana "shi"', frequency: 10, example: 'Common character' },

        // A-row
        { char: 'ア', romaji: 'a', meaning: 'katakana "a"', frequency: 11, example: 'Vowel a' },
        { char: 'ウ', romaji: 'u', meaning: 'katakana "u"', frequency: 12, example: 'Vowel u' },
        { char: 'エ', romaji: 'e', meaning: 'katakana "e"', frequency: 13, example: 'Vowel e' },
        { char: 'オ', romaji: 'o', meaning: 'katakana "o"', frequency: 14, example: 'Vowel o' },

        // K-row
        { char: 'カ', romaji: 'ka', meaning: 'katakana "ka"', frequency: 15, example: 'Common character' },
        { char: 'キ', romaji: 'ki', meaning: 'katakana "ki"', frequency: 16, example: 'Common character' },
        { char: 'ケ', romaji: 'ke', meaning: 'katakana "ke"', frequency: 17, example: 'Common character' },
        { char: 'コ', romaji: 'ko', meaning: 'katakana "ko"', frequency: 18, example: 'Common character' },

        // S-row
        { char: 'サ', romaji: 'sa', meaning: 'katakana "sa"', frequency: 19, example: 'Common character' },
        { char: 'セ', romaji: 'se', meaning: 'katakana "se"', frequency: 20, example: 'Common character' },
        { char: 'ソ', romaji: 'so', meaning: 'katakana "so"', frequency: 21, example: 'Common character' },

        // T-row
        { char: 'タ', romaji: 'ta', meaning: 'katakana "ta"', frequency: 22, example: 'Common character' },
        { char: 'チ', romaji: 'chi', meaning: 'katakana "chi"', frequency: 23, example: 'Common character' },
        { char: 'ツ', romaji: 'tsu', meaning: 'katakana "tsu"', frequency: 24, example: 'Common character' },

        // N-row
        { char: 'ナ', romaji: 'na', meaning: 'katakana "na"', frequency: 25, example: 'Common character' },
        { char: 'ニ', romaji: 'ni', meaning: 'katakana "ni"', frequency: 26, example: 'Common character' },
        { char: 'ネ', romaji: 'ne', meaning: 'katakana "ne"', frequency: 27, example: 'Common character' },
        { char: 'ノ', romaji: 'no', meaning: 'katakana "no"', frequency: 28, example: 'Common character' },

        // H-row
        { char: 'ハ', romaji: 'ha', meaning: 'katakana "ha"', frequency: 29, example: 'Common character' },
        { char: 'ヒ', romaji: 'hi', meaning: 'katakana "hi"', frequency: 30, example: 'Common character' },
        { char: 'フ', romaji: 'fu', meaning: 'katakana "fu"', frequency: 31, example: 'Common character' },
        { char: 'ヘ', romaji: 'he', meaning: 'katakana "he"', frequency: 32, example: 'Common character' },
        { char: 'ホ', romaji: 'ho', meaning: 'katakana "ho"', frequency: 33, example: 'Common character' },

        // M-row
        { char: 'マ', romaji: 'ma', meaning: 'katakana "ma"', frequency: 34, example: 'Common character' },
        { char: 'ミ', romaji: 'mi', meaning: 'katakana "mi"', frequency: 35, example: 'Common character' },
        { char: 'ム', romaji: 'mu', meaning: 'katakana "mu"', frequency: 36, example: 'Common character' },
        { char: 'メ', romaji: 'me', meaning: 'katakana "me"', frequency: 37, example: 'Common character' },
        { char: 'モ', romaji: 'mo', meaning: 'katakana "mo"', frequency: 38, example: 'Common character' },

        // Y-row
        { char: 'ヤ', romaji: 'ya', meaning: 'katakana "ya"', frequency: 39, example: 'Common character' },
        { char: 'ユ', romaji: 'yu', meaning: 'katakana "yu"', frequency: 40, example: 'Common character' },
        { char: 'ヨ', romaji: 'yo', meaning: 'katakana "yo"', frequency: 41, example: 'Common character' },

        // R-row
        { char: 'ラ', romaji: 'ra', meaning: 'katakana "ra"', frequency: 42, example: 'Common character' },
        { char: 'レ', romaji: 're', meaning: 'katakana "re"', frequency: 43, example: 'Common character' },
        { char: 'ロ', romaji: 'ro', meaning: 'katakana "ro"', frequency: 44, example: 'Common character' },

        // W-row
        { char: 'ワ', romaji: 'wa', meaning: 'katakana "wa"', frequency: 45, example: 'Common character' }
    ],

    kanji: [
        { char: '人', romaji: 'hito/jin/nin', meaning: 'person, people', frequency: 1, example: '人 (hito) - person' },
        { char: '日', romaji: 'hi/nichi/ka', meaning: 'day, sun', frequency: 2, example: '日本 (nihon) - Japan' },
        { char: '一', romaji: 'ichi/hitotsu', meaning: 'one', frequency: 3, example: '一つ (hitotsu) - one thing' },
        { char: '国', romaji: 'kuni/koku', meaning: 'country', frequency: 4, example: '国 (kuni) - country' },
        { char: '年', romaji: 'toshi/nen', meaning: 'year', frequency: 5, example: '今年 (kotoshi) - this year' },
        { char: '大', romaji: 'oo/dai/tai', meaning: 'big, large', frequency: 6, example: '大きい (ookii) - big' },
        { char: '十', romaji: 'juu/to', meaning: 'ten', frequency: 7, example: '十 (juu) - ten' },
        { char: '二', romaji: 'ni/futatsu', meaning: 'two', frequency: 8, example: '二つ (futatsu) - two things' },
        { char: '本', romaji: 'hon/moto', meaning: 'book, origin', frequency: 9, example: '本 (hon) - book' },
        { char: '中', romaji: 'naka/chuu', meaning: 'middle, inside', frequency: 10, example: '中 (naka) - inside' },
        { char: '長', romaji: 'nagai/chou', meaning: 'long, chief', frequency: 11, example: '長い (nagai) - long' },
        { char: '出', romaji: 'deru/shutsu', meaning: 'exit, come out', frequency: 12, example: '出る (deru) - to exit' },
        { char: '三', romaji: 'san/mittsu', meaning: 'three', frequency: 13, example: '三つ (mittsu) - three things' },
        { char: '時', romaji: 'toki/ji', meaning: 'time', frequency: 14, example: '時間 (jikan) - time' },
        { char: '行', romaji: 'iku/kou/gyou', meaning: 'go, line', frequency: 15, example: '行く (iku) - to go' },
        { char: '見', romaji: 'miru/ken', meaning: 'see, look', frequency: 16, example: '見る (miru) - to see' },
        { char: '月', romaji: 'tsuki/getsu/gatsu', meaning: 'moon, month', frequency: 17, example: '月 (tsuki) - moon' },
        { char: '分', romaji: 'wakaru/fun/bun', meaning: 'minute, understand', frequency: 18, example: '分かる (wakaru) - to understand' },
        { char: '後', romaji: 'ato/go/kou', meaning: 'after, behind', frequency: 19, example: '後で (ato de) - later' },
        { char: '前', romaji: 'mae/zen', meaning: 'before, in front', frequency: 20, example: '前 (mae) - front' },
        { char: '生', romaji: 'nama/sei/shou', meaning: 'life, birth, student', frequency: 21, example: '学生 (gakusei) - student' },
        { char: '五', romaji: 'go/itsutsu', meaning: 'five', frequency: 22, example: '五つ (itsutsu) - five things' },
        { char: '間', romaji: 'aida/kan/ken', meaning: 'interval, space', frequency: 23, example: '時間 (jikan) - time' },
        { char: '上', romaji: 'ue/kami/jou', meaning: 'up, above', frequency: 24, example: '上 (ue) - above' },
        { char: '東', romaji: 'higashi/tou', meaning: 'east', frequency: 25, example: '東京 (toukyou) - Tokyo' },
        { char: '四', romaji: 'shi/yon/yottsu', meaning: 'four', frequency: 26, example: '四つ (yottsu) - four things' },
        { char: '今', romaji: 'ima/kon/kin', meaning: 'now', frequency: 27, example: '今 (ima) - now' },
        { char: '金', romaji: 'kane/kin', meaning: 'gold, money', frequency: 28, example: 'お金 (okane) - money' },
        { char: '九', romaji: 'kyuu/ku/kokonotsu', meaning: 'nine', frequency: 29, example: '九つ (kokonotsu) - nine things' },
        { char: '入', romaji: 'hairu/nyuu', meaning: 'enter', frequency: 30, example: '入る (hairu) - to enter' },
        { char: '学', romaji: 'manabu/gaku', meaning: 'study, learning', frequency: 31, example: '学校 (gakkou) - school' },
        { char: '高', romaji: 'takai/kou', meaning: 'high, tall, expensive', frequency: 32, example: '高い (takai) - high/expensive' },
        { char: '円', romaji: 'en', meaning: 'yen, circle', frequency: 33, example: '百円 (hyaku en) - 100 yen' },
        { char: '子', romaji: 'ko/shi', meaning: 'child', frequency: 34, example: '子供 (kodomo) - child' },
        { char: '外', romaji: 'soto/gai', meaning: 'outside', frequency: 35, example: '外 (soto) - outside' },
        { char: '八', romaji: 'hachi/ya/yattsu', meaning: 'eight', frequency: 36, example: '八つ (yattsu) - eight things' },
        { char: '六', romaji: 'roku/muttsu', meaning: 'six', frequency: 37, example: '六つ (muttsu) - six things' },
        { char: '下', romaji: 'shita/shimo/ka/ge', meaning: 'down, below', frequency: 38, example: '下 (shita) - below' },
        { char: '来', romaji: 'kuru/rai', meaning: 'come', frequency: 39, example: '来る (kuru) - to come' },
        { char: '気', romaji: 'ki/ke', meaning: 'spirit, mind', frequency: 40, example: '元気 (genki) - healthy' },
        { char: '小', romaji: 'chiisai/shou', meaning: 'small, little', frequency: 41, example: '小さい (chiisai) - small' },
        { char: '七', romaji: 'shichi/nana/nanatsu', meaning: 'seven', frequency: 42, example: '七つ (nanatsu) - seven things' },
        { char: '山', romaji: 'yama/san', meaning: 'mountain', frequency: 43, example: '山 (yama) - mountain' },
        { char: '話', romaji: 'hanashi/wa', meaning: 'talk, story', frequency: 44, example: '話す (hanasu) - to speak' },
        { char: '女', romaji: 'onna/jo/nyo', meaning: 'woman', frequency: 45, example: '女性 (josei) - woman' },
        { char: '北', romaji: 'kita/hoku', meaning: 'north', frequency: 46, example: '北 (kita) - north' },
        { char: '午', romaji: 'go', meaning: 'noon', frequency: 47, example: '午後 (gogo) - afternoon' },
        { char: '百', romaji: 'hyaku', meaning: 'hundred', frequency: 48, example: '百 (hyaku) - hundred' },
        { char: '書', romaji: 'kaku/sho', meaning: 'write', frequency: 49, example: '書く (kaku) - to write' },
        { char: '先', romaji: 'saki/sen', meaning: 'previous, ahead', frequency: 50, example: '先生 (sensei) - teacher' }
    ],

    numbers: [
        { char: '零', romaji: 'rei/zero', meaning: 'zero', frequency: 1, category: 'numbers', example: '零時 (reiji) - midnight' },
        { char: '一', romaji: 'ichi', meaning: 'one', frequency: 2, category: 'numbers', example: '一つ (hitotsu) - one thing' },
        { char: '二', romaji: 'ni', meaning: 'two', frequency: 3, category: 'numbers', example: '二つ (futatsu) - two things' },
        { char: '三', romaji: 'san', meaning: 'three', frequency: 4, category: 'numbers', example: '三つ (mittsu) - three things' },
        { char: '四', romaji: 'shi/yon', meaning: 'four', frequency: 5, category: 'numbers', example: '四つ (yottsu) - four things' },
        { char: '五', romaji: 'go', meaning: 'five', frequency: 6, category: 'numbers', example: '五つ (itsutsu) - five things' },
        { char: '六', romaji: 'roku', meaning: 'six', frequency: 7, category: 'numbers', example: '六つ (muttsu) - six things' },
        { char: '七', romaji: 'shichi/nana', meaning: 'seven', frequency: 8, category: 'numbers', example: '七つ (nanatsu) - seven things' },
        { char: '八', romaji: 'hachi', meaning: 'eight', frequency: 9, category: 'numbers', example: '八つ (yattsu) - eight things' },
        { char: '九', romaji: 'kyuu/ku', meaning: 'nine', frequency: 10, category: 'numbers', example: '九つ (kokonotsu) - nine things' },
        { char: '十', romaji: 'juu', meaning: 'ten', frequency: 11, category: 'numbers', example: '十 (juu) - ten' },
        { char: '百', romaji: 'hyaku', meaning: 'hundred', frequency: 12, category: 'numbers', example: '百 (hyaku) - hundred' },
        { char: '千', romaji: 'sen', meaning: 'thousand', frequency: 13, category: 'numbers', example: '千 (sen) - thousand' },
        { char: '万', romaji: 'man', meaning: 'ten thousand', frequency: 14, category: 'numbers', example: '一万 (ichiman) - ten thousand' }
    ],

    colors: [
        { char: '赤', romaji: 'aka', meaning: 'red', frequency: 1, category: 'colors', example: '赤い (akai) - red' },
        { char: '青', romaji: 'ao', meaning: 'blue', frequency: 2, category: 'colors', example: '青い (aoi) - blue' },
        { char: '黒', romaji: 'kuro', meaning: 'black', frequency: 3, category: 'colors', example: '黒い (kuroi) - black' },
        { char: '白', romaji: 'shiro', meaning: 'white', frequency: 4, category: 'colors', example: '白い (shiroi) - white' },
        { char: '黄', romaji: 'ki', meaning: 'yellow', frequency: 5, category: 'colors', example: '黄色 (kiiro) - yellow' },
        { char: '緑', romaji: 'midori', meaning: 'green', frequency: 6, category: 'colors', example: '緑 (midori) - green' },
        { char: '茶', romaji: 'cha', meaning: 'brown, tea', frequency: 7, category: 'colors', example: '茶色 (chairo) - brown' },
        { char: '紫', romaji: 'murasaki', meaning: 'purple', frequency: 8, category: 'colors', example: '紫 (murasaki) - purple' },
        { char: '桃', romaji: 'momo', meaning: 'pink, peach', frequency: 9, category: 'colors', example: '桃色 (momoiro) - pink' },
        { char: '灰', romaji: 'hai', meaning: 'gray, ash', frequency: 10, category: 'colors', example: '灰色 (haiiro) - gray' }
    ],

    words: [
        // Common verbs
        { char: '食べる', romaji: 'taberu', meaning: 'to eat', frequency: 1, example: '朝ご飯を食べる (I eat breakfast)' },
        { char: '飲む', romaji: 'nomu', meaning: 'to drink', frequency: 2, example: '水を飲む (I drink water)' },
        { char: '行く', romaji: 'iku', meaning: 'to go', frequency: 3, example: '学校に行く (I go to school)' },
        { char: '来る', romaji: 'kuru', meaning: 'to come', frequency: 4, example: '友達が来る (My friend comes)' },
        { char: '見る', romaji: 'miru', meaning: 'to see, to watch', frequency: 5, example: 'テレビを見る (I watch TV)' },
        { char: '聞く', romaji: 'kiku', meaning: 'to hear, to listen', frequency: 6, example: '音楽を聞く (I listen to music)' },
        { char: '話す', romaji: 'hanasu', meaning: 'to speak, to talk', frequency: 7, example: '日本語を話す (I speak Japanese)' },
        { char: '読む', romaji: 'yomu', meaning: 'to read', frequency: 8, example: '本を読む (I read a book)' },
        { char: '書く', romaji: 'kaku', meaning: 'to write', frequency: 9, example: '手紙を書く (I write a letter)' },
        { char: '買う', romaji: 'kau', meaning: 'to buy', frequency: 10, example: 'パンを買う (I buy bread)' },
        { char: 'する', romaji: 'suru', meaning: 'to do', frequency: 11, example: '勉強する (I study)' },
        { char: '作る', romaji: 'tsukuru', meaning: 'to make', frequency: 12, example: '料理を作る (I cook)' },
        { char: '待つ', romaji: 'matsu', meaning: 'to wait', frequency: 13, example: 'バスを待つ (I wait for the bus)' },
        { char: '会う', romaji: 'au', meaning: 'to meet', frequency: 14, example: '友達に会う (I meet a friend)' },
        { char: '帰る', romaji: 'kaeru', meaning: 'to return home', frequency: 15, example: '家に帰る (I go home)' },

        // Common nouns
        { char: '水', romaji: 'mizu', meaning: 'water', frequency: 16, example: '水を飲む (I drink water)' },
        { char: '本', romaji: 'hon', meaning: 'book', frequency: 17, example: '本を読む (I read a book)' },
        { char: '家', romaji: 'ie/uchi', meaning: 'house, home', frequency: 18, example: '家に帰る (I go home)' },
        { char: '学校', romaji: 'gakkou', meaning: 'school', frequency: 19, example: '学校に行く (I go to school)' },
        { char: '先生', romaji: 'sensei', meaning: 'teacher', frequency: 20, example: '先生に聞く (I ask the teacher)' },
        { char: '友達', romaji: 'tomodachi', meaning: 'friend', frequency: 21, example: '友達と遊ぶ (I play with friends)' },
        { char: '時間', romaji: 'jikan', meaning: 'time', frequency: 22, example: '時間がない (There is no time)' },
        { char: '今日', romaji: 'kyou', meaning: 'today', frequency: 23, example: '今日は暑い (Today is hot)' },
        { char: '明日', romaji: 'ashita', meaning: 'tomorrow', frequency: 24, example: '明日行く (I will go tomorrow)' },
        { char: '昨日', romaji: 'kinou', meaning: 'yesterday', frequency: 25, example: '昨日見た (I saw it yesterday)' },

        // Common adjectives
        { char: '大きい', romaji: 'ookii', meaning: 'big', frequency: 26, example: '大きい家 (big house)' },
        { char: '小さい', romaji: 'chiisai', meaning: 'small', frequency: 27, example: '小さい犬 (small dog)' },
        { char: '新しい', romaji: 'atarashii', meaning: 'new', frequency: 28, example: '新しい本 (new book)' },
        { char: '古い', romaji: 'furui', meaning: 'old (things)', frequency: 29, example: '古い家 (old house)' },
        { char: '良い', romaji: 'yoi/ii', meaning: 'good', frequency: 30, example: '良い天気 (good weather)' },
        { char: '悪い', romaji: 'warui', meaning: 'bad', frequency: 31, example: '悪い人 (bad person)' },
        { char: '高い', romaji: 'takai', meaning: 'high, expensive', frequency: 32, example: '高いビル (tall building)' },
        { char: '安い', romaji: 'yasui', meaning: 'cheap', frequency: 33, example: '安いパン (cheap bread)' },
        { char: '面白い', romaji: 'omoshiroi', meaning: 'interesting', frequency: 34, example: '面白い本 (interesting book)' },
        { char: 'おいしい', romaji: 'oishii', meaning: 'delicious', frequency: 35, example: 'おいしい料理 (delicious food)' },

        // More common words
        { char: 'ありがとう', romaji: 'arigatou', meaning: 'thank you', frequency: 36, example: 'ありがとうございます (thank you politely)' },
        { char: 'すみません', romaji: 'sumimasen', meaning: 'excuse me, sorry', frequency: 37, example: 'すみません、質問があります (Excuse me, I have a question)' },
        { char: 'お願いします', romaji: 'onegaishimasu', meaning: 'please', frequency: 38, example: 'お願いします (Please help me)' },
        { char: 'はい', romaji: 'hai', meaning: 'yes', frequency: 39, example: 'はい、そうです (Yes, that\'s right)' },
        { char: 'いいえ', romaji: 'iie', meaning: 'no', frequency: 40, example: 'いいえ、違います (No, that\'s wrong)' }
    ],

    sentences: [
        // Basic greetings
        { char: 'おはようございます', romaji: 'ohayou gozaimasu', meaning: 'Good morning', frequency: 1, example: 'Formal morning greeting' },
        { char: 'こんにちは', romaji: 'konnichiwa', meaning: 'Hello, Good afternoon', frequency: 2, example: 'Daytime greeting' },
        { char: 'こんばんは', romaji: 'konbanwa', meaning: 'Good evening', frequency: 3, example: 'Evening greeting' },
        { char: 'おやすみなさい', romaji: 'oyasuminasai', meaning: 'Good night', frequency: 4, example: 'Before going to bed' },
        { char: 'さようなら', romaji: 'sayounara', meaning: 'Goodbye', frequency: 5, example: 'Formal farewell' },

        // Essential phrases
        { char: '私は学生です', romaji: 'watashi wa gakusei desu', meaning: 'I am a student', frequency: 6, example: 'Self-introduction' },
        { char: 'お名前は何ですか？', romaji: 'onamae wa nan desu ka?', meaning: 'What is your name?', frequency: 7, example: 'Asking someone\'s name' },
        { char: '元気ですか？', romaji: 'genki desu ka?', meaning: 'How are you?', frequency: 8, example: 'Greeting question' },
        { char: 'はい、元気です', romaji: 'hai, genki desu', meaning: 'Yes, I\'m fine', frequency: 9, example: 'Response to greeting' },
        { char: 'お腹が空きました', romaji: 'onaka ga sukimashita', meaning: 'I\'m hungry', frequency: 10, example: 'Expressing hunger' },

        // Common verbs in sentences (eating, drinking)
        { char: '朝ご飯を食べます', romaji: 'asagohan wo tabemasu', meaning: 'I eat breakfast', frequency: 11, example: 'Eating meal' },
        { char: 'パンを食べました', romaji: 'pan wo tabemashita', meaning: 'I ate bread', frequency: 12, example: 'Past tense eating' },
        { char: '水を飲みます', romaji: 'mizu wo nomimasu', meaning: 'I drink water', frequency: 13, example: 'Drinking action' },
        { char: 'お茶を飲みましょう', romaji: 'ocha wo nomimashou', meaning: 'Let\'s drink tea', frequency: 14, example: 'Suggestion to drink' },
        { char: 'コーヒーを飲みたいです', romaji: 'koohii wo nomitai desu', meaning: 'I want to drink coffee', frequency: 15, example: 'Expressing desire' },

        // Movement verbs (going, coming)
        { char: '学校に行きます', romaji: 'gakkou ni ikimasu', meaning: 'I go to school', frequency: 16, example: 'Going to place' },
        { char: '東京へ行きました', romaji: 'toukyou e ikimashita', meaning: 'I went to Tokyo', frequency: 17, example: 'Past tense going' },
        { char: '友達が来ます', romaji: 'tomodachi ga kimasu', meaning: 'My friend comes/will come', frequency: 18, example: 'Someone coming' },
        { char: '明日来てください', romaji: 'ashita kite kudasai', meaning: 'Please come tomorrow', frequency: 19, example: 'Polite request to come' },
        { char: '家に帰ります', romaji: 'ie ni kaerimasu', meaning: 'I return home', frequency: 20, example: 'Going back home' },

        // Perception verbs (seeing, watching, listening)
        { char: 'テレビを見ます', romaji: 'terebi wo mimasu', meaning: 'I watch TV', frequency: 21, example: 'Watching something' },
        { char: '映画を見ました', romaji: 'eiga wo mimashita', meaning: 'I watched a movie', frequency: 22, example: 'Past tense watching' },
        { char: '音楽を聞きます', romaji: 'ongaku wo kikimasu', meaning: 'I listen to music', frequency: 23, example: 'Listening action' },
        { char: '先生の話を聞いてください', romaji: 'sensei no hanashi wo kiite kudasai', meaning: 'Please listen to the teacher', frequency: 24, example: 'Polite request to listen' },

        // Reading and writing
        { char: '本を読みます', romaji: 'hon wo yomimasu', meaning: 'I read a book', frequency: 25, example: 'Reading action' },
        { char: '新聞を読みました', romaji: 'shinbun wo yomimashita', meaning: 'I read a newspaper', frequency: 26, example: 'Past tense reading' },
        { char: '手紙を書きます', romaji: 'tegami wo kakimasu', meaning: 'I write a letter', frequency: 27, example: 'Writing action' },
        { char: '日本語を書けます', romaji: 'nihongo wo kakemasu', meaning: 'I can write Japanese', frequency: 28, example: 'Ability to write' },

        // Shopping and buying
        { char: 'パンを買います', romaji: 'pan wo kaimasu', meaning: 'I buy bread', frequency: 29, example: 'Buying action' },
        { char: '昨日本を買いました', romaji: 'kinou hon wo kaimashita', meaning: 'I bought a book yesterday', frequency: 30, example: 'Past tense buying' },
        { char: 'これをください', romaji: 'kore wo kudasai', meaning: 'Please give me this', frequency: 31, example: 'Shopping phrase' },
        { char: 'いくらですか？', romaji: 'ikura desu ka?', meaning: 'How much is it?', frequency: 32, example: 'Asking price' },

        // Making and doing
        { char: '料理を作ります', romaji: 'ryouri wo tsukurimasu', meaning: 'I cook/make food', frequency: 33, example: 'Cooking action' },
        { char: '宿題をします', romaji: 'shukudai wo shimasu', meaning: 'I do homework', frequency: 34, example: 'Doing homework' },
        { char: '勉強しました', romaji: 'benkyou shimashita', meaning: 'I studied', frequency: 35, example: 'Past tense studying' },

        // Waiting and meeting
        { char: 'バスを待ちます', romaji: 'basu wo machimasu', meaning: 'I wait for the bus', frequency: 36, example: 'Waiting action' },
        { char: '友達に会います', romaji: 'tomodachi ni aimasu', meaning: 'I meet a friend', frequency: 37, example: 'Meeting someone' },
        { char: '駅で会いましょう', romaji: 'eki de aimashou', meaning: 'Let\'s meet at the station', frequency: 38, example: 'Suggestion to meet' },

        // Time expressions
        { char: '今何時ですか？', romaji: 'ima nanji desu ka?', meaning: 'What time is it now?', frequency: 39, example: 'Asking the time' },
        { char: '三時です', romaji: 'sanji desu', meaning: 'It\'s 3 o\'clock', frequency: 40, example: 'Telling the time' },
        { char: '今日は暑いですね', romaji: 'kyou wa atsui desu ne', meaning: 'Today is hot, isn\'t it?', frequency: 41, example: 'Weather comment' },
        { char: '明日は雨です', romaji: 'ashita wa ame desu', meaning: 'Tomorrow will be rain', frequency: 42, example: 'Weather prediction' },

        // Adjective sentences
        { char: 'この本は面白いです', romaji: 'kono hon wa omoshiroi desu', meaning: 'This book is interesting', frequency: 43, example: 'Describing with adjective' },
        { char: 'その店は高いです', romaji: 'sono mise wa takai desu', meaning: 'That shop is expensive', frequency: 44, example: 'Price description' },
        { char: '部屋が大きいです', romaji: 'heya ga ookii desu', meaning: 'The room is big', frequency: 45, example: 'Size description' },
        { char: '日本語は難しいです', romaji: 'nihongo wa muzukashii desu', meaning: 'Japanese is difficult', frequency: 46, example: 'Difficulty description' },

        // More practical sentences
        { char: 'トイレはどこですか？', romaji: 'toire wa doko desu ka?', meaning: 'Where is the toilet?', frequency: 47, example: 'Asking for location' },
        { char: '駅はあそこです', romaji: 'eki wa asoko desu', meaning: 'The station is over there', frequency: 48, example: 'Giving directions' },
        { char: '分かりません', romaji: 'wakarimasen', meaning: 'I don\'t understand', frequency: 49, example: 'Expressing confusion' },
        { char: 'もう一度お願いします', romaji: 'mou ichido onegaishimasu', meaning: 'Please say it once more', frequency: 50, example: 'Asking for repetition' }
    ]
};

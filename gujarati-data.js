// Gujarati Learning Data
// Comprehensive data for learning Gujarati with spaced repetition

const gujaratiData = {
    vowels: [
        // Gujarati vowels (સ્વર)
        { char: 'અ', romaji: 'a', meaning: 'vowel a', frequency: 1, example: 'અમે (ame - we)' },
        { char: 'આ', romaji: 'ā', meaning: 'vowel ā', frequency: 2, example: 'આપ (āp - you)' },
        { char: 'ઇ', romaji: 'i', meaning: 'vowel i', frequency: 3, example: 'ઇચ્છા (icchā - wish)' },
        { char: 'ઈ', romaji: 'ī', meaning: 'vowel ī', frequency: 4, example: 'ઈશ્વર (īśvar - god)' },
        { char: 'ઉ', romaji: 'u', meaning: 'vowel u', frequency: 5, example: 'ઉત્તર (uttar - north)' },
        { char: 'ઊ', romaji: 'ū', meaning: 'vowel ū', frequency: 6, example: 'ઊંચું (ūṃcuṃ - tall)' },
        { char: 'ઋ', romaji: 'ṛ', meaning: 'vowel ṛ', frequency: 7, example: 'ઋષિ (ṛṣi - sage)' },
        { char: 'એ', romaji: 'e', meaning: 'vowel e', frequency: 8, example: 'એક (ek - one)' },
        { char: 'ઐ', romaji: 'ai', meaning: 'vowel ai', frequency: 9, example: 'ઐશ્વર્ય (aiśvarya - wealth)' },
        { char: 'ઓ', romaji: 'o', meaning: 'vowel o', frequency: 10, example: 'ઓળખ (oḷakh - identity)' },
        { char: 'ઔ', romaji: 'au', meaning: 'vowel au', frequency: 11, example: 'ઔષધ (auṣadh - medicine)' }
    ],

    consonants: [
        // Gujarati consonants (વ્યંજન)
        { char: 'ક', romaji: 'ka', meaning: 'consonant ka', frequency: 1, example: 'કમળ (kamaḷ - lotus)' },
        { char: 'ખ', romaji: 'kha', meaning: 'consonant kha', frequency: 2, example: 'ખુશી (khushī - happiness)' },
        { char: 'ગ', romaji: 'ga', meaning: 'consonant ga', frequency: 3, example: 'ગામ (gām - village)' },
        { char: 'ઘ', romaji: 'gha', meaning: 'consonant gha', frequency: 4, example: 'ઘર (ghar - house)' },
        { char: 'ઙ', romaji: 'ṅa', meaning: 'consonant ṅa', frequency: 5, example: 'Used in conjuncts' },
        { char: 'ચ', romaji: 'ca', meaning: 'consonant ca', frequency: 6, example: 'ચા (cā - tea)' },
        { char: 'છ', romaji: 'cha', meaning: 'consonant cha', frequency: 7, example: 'છોકરો (chokaro - boy)' },
        { char: 'જ', romaji: 'ja', meaning: 'consonant ja', frequency: 8, example: 'જળ (jaḷ - water)' },
        { char: 'ઝ', romaji: 'jha', meaning: 'consonant jha', frequency: 9, example: 'ઝાડ (jhāḍ - tree)' },
        { char: 'ઞ', romaji: 'ña', meaning: 'consonant ña', frequency: 10, example: 'Used in conjuncts' },
        { char: 'ટ', romaji: 'ṭa', meaning: 'consonant ṭa', frequency: 11, example: 'ટોપી (ṭopī - hat)' },
        { char: 'ઠ', romaji: 'ṭha', meaning: 'consonant ṭha', frequency: 12, example: 'ઠંડી (ṭhaṇḍī - cold)' },
        { char: 'ડ', romaji: 'ḍa', meaning: 'consonant ḍa', frequency: 13, example: 'ડબ્બો (ḍabbo - box)' },
        { char: 'ઢ', romaji: 'ḍha', meaning: 'consonant ḍha', frequency: 14, example: 'ઢોલ (ḍhol - drum)' },
        { char: 'ણ', romaji: 'ṇa', meaning: 'consonant ṇa', frequency: 15, example: 'જાણવું (jāṇavuṃ - to know)' },
        { char: 'ત', romaji: 'ta', meaning: 'consonant ta', frequency: 16, example: 'તમે (tame - you)' },
        { char: 'થ', romaji: 'tha', meaning: 'consonant tha', frequency: 17, example: 'થાળી (thāḷī - plate)' },
        { char: 'દ', romaji: 'da', meaning: 'consonant da', frequency: 18, example: 'દિવસ (divas - day)' },
        { char: 'ધ', romaji: 'dha', meaning: 'consonant dha', frequency: 19, example: 'ધન (dhan - wealth)' },
        { char: 'ન', romaji: 'na', meaning: 'consonant na', frequency: 20, example: 'નામ (nām - name)' },
        { char: 'પ', romaji: 'pa', meaning: 'consonant pa', frequency: 21, example: 'પાણી (pāṇī - water)' },
        { char: 'ફ', romaji: 'pha', meaning: 'consonant pha', frequency: 22, example: 'ફૂલ (phūl - flower)' },
        { char: 'બ', romaji: 'ba', meaning: 'consonant ba', frequency: 23, example: 'બાળક (bāḷak - child)' },
        { char: 'ભ', romaji: 'bha', meaning: 'consonant bha', frequency: 24, example: 'ભાષા (bhāṣā - language)' },
        { char: 'મ', romaji: 'ma', meaning: 'consonant ma', frequency: 25, example: 'માતા (mātā - mother)' },
        { char: 'ય', romaji: 'ya', meaning: 'consonant ya', frequency: 26, example: 'યુવા (yuvā - youth)' },
        { char: 'ર', romaji: 'ra', meaning: 'consonant ra', frequency: 27, example: 'રાત (rāt - night)' },
        { char: 'લ', romaji: 'la', meaning: 'consonant la', frequency: 28, example: 'લાલ (lāl - red)' },
        { char: 'વ', romaji: 'va', meaning: 'consonant va', frequency: 29, example: 'વાત (vāt - talk)' },
        { char: 'શ', romaji: 'śa', meaning: 'consonant śa', frequency: 30, example: 'શાળા (śāḷā - school)' },
        { char: 'ષ', romaji: 'ṣa', meaning: 'consonant ṣa', frequency: 31, example: 'ષડયંત્ર (ṣaḍyantra - conspiracy)' },
        { char: 'સ', romaji: 'sa', meaning: 'consonant sa', frequency: 32, example: 'સત્ય (satya - truth)' },
        { char: 'હ', romaji: 'ha', meaning: 'consonant ha', frequency: 33, example: 'હા (hā - yes)' },
        { char: 'ળ', romaji: 'ḷa', meaning: 'consonant ḷa', frequency: 34, example: 'જળ (jaḷ - water)' },
        { char: 'ક્ષ', romaji: 'kṣa', meaning: 'conjunct kṣa', frequency: 35, example: 'ક્ષત્રિય (kṣatriya - warrior)' },
        { char: 'જ્ઞ', romaji: 'jña', meaning: 'conjunct jña', frequency: 36, example: 'જ્ઞાન (jñān - knowledge)' }
    ],

    numbers: [
        { char: 'શૂન્ય', romaji: 'śūnya', meaning: 'zero', frequency: 1, category: 'numbers', example: 'શૂન્ય ડિગ્રી (zero degrees)' },
        { char: 'એક', romaji: 'ek', meaning: 'one', frequency: 2, category: 'numbers', example: 'એક બિલાડી (one cat)' },
        { char: 'બે', romaji: 'be', meaning: 'two', frequency: 3, category: 'numbers', example: 'બે સફરજન (two apples)' },
        { char: 'ત્રણ', romaji: 'traṇ', meaning: 'three', frequency: 4, category: 'numbers', example: 'ત્રણ પુસ્તકો (three books)' },
        { char: 'ચાર', romaji: 'cār', meaning: 'four', frequency: 5, category: 'numbers', example: 'ચાર વર્ષ (four years)' },
        { char: 'પાંચ', romaji: 'pāṃc', meaning: 'five', frequency: 6, category: 'numbers', example: 'પાંચ રૂપિયા (five rupees)' },
        { char: 'છ', romaji: 'cha', meaning: 'six', frequency: 7, category: 'numbers', example: 'છ કલાક (six hours)' },
        { char: 'સાત', romaji: 'sāt', meaning: 'seven', frequency: 8, category: 'numbers', example: 'સાત દિવસ (seven days)' },
        { char: 'આઠ', romaji: 'āṭh', meaning: 'eight', frequency: 9, category: 'numbers', example: 'આઠ લોકો (eight people)' },
        { char: 'નવ', romaji: 'nav', meaning: 'nine', frequency: 10, category: 'numbers', example: 'નવ મહિનો (nine months)' },
        { char: 'દસ', romaji: 'das', meaning: 'ten', frequency: 11, category: 'numbers', example: 'દસ મિનિટ (ten minutes)' },
        { char: 'વીસ', romaji: 'vīs', meaning: 'twenty', frequency: 12, category: 'numbers', example: 'વીસ વર્ષ (twenty years)' },
        { char: 'સો', romaji: 'so', meaning: 'hundred', frequency: 13, category: 'numbers', example: 'સો રૂપિયા (one hundred rupees)' },
        { char: 'હજાર', romaji: 'hajār', meaning: 'thousand', frequency: 14, category: 'numbers', example: 'હજાર લોકો (one thousand people)' }
    ],

    colors: [
        { char: 'લાલ', romaji: 'lāl', meaning: 'red', frequency: 1, category: 'colors', example: 'લાલ કાર (red car)' },
        { char: 'વાદળી', romaji: 'vādaḷī', meaning: 'blue', frequency: 2, category: 'colors', example: 'વાદળી આકાશ (blue sky)' },
        { char: 'લીલો', romaji: 'līlo', meaning: 'green', frequency: 3, category: 'colors', example: 'લીલો ઘાસ (green grass)' },
        { char: 'પીળો', romaji: 'pīḷo', meaning: 'yellow', frequency: 4, category: 'colors', example: 'પીળો સૂર્ય (yellow sun)' },
        { char: 'કાળો', romaji: 'kāḷo', meaning: 'black', frequency: 5, category: 'colors', example: 'કાળી બિલાડી (black cat)' },
        { char: 'સફેદ', romaji: 'saphed', meaning: 'white', frequency: 6, category: 'colors', example: 'સફેદ બરફ (white snow)' },
        { char: 'નારંગી', romaji: 'nāraṃgī', meaning: 'orange', frequency: 7, category: 'colors', example: 'નારંગી ફળ (orange fruit)' },
        { char: 'ગુલાબી', romaji: 'gulābī', meaning: 'pink', frequency: 8, category: 'colors', example: 'ગુલાબી ફૂલ (pink flower)' },
        { char: 'જાંબુડો', romaji: 'jāṃbuḍo', meaning: 'purple', frequency: 9, category: 'colors', example: 'જાંબુડો ડ્રેસ (purple dress)' },
        { char: 'રાખોડી', romaji: 'rākhoḍī', meaning: 'gray', frequency: 10, category: 'colors', example: 'રાખોડી વાદળ (gray cloud)' },
        { char: 'ભૂરો', romaji: 'bhūro', meaning: 'brown', frequency: 11, category: 'colors', example: 'ભૂરા જૂતા (brown shoes)' }
    ],

    words: [
        // Common verbs - હોવું (to be)
        { char: 'હોવું', romaji: 'hovuṃ', meaning: 'to be', frequency: 1, example: 'હું વિદ્યાર્થી છું (I am a student)' },
        { char: 'છું', romaji: 'chuṃ', meaning: 'am (I am)', frequency: 2, example: 'હું ખુશ છું (I am happy)' },
        { char: 'છે', romaji: 'che', meaning: 'is/are (he/she/it is, you are)', frequency: 3, example: 'તે અહીં છે (He is here)' },
        { char: 'છો', romaji: 'cho', meaning: 'are (you are - informal)', frequency: 4, example: 'તમે કેમ છો? (How are you?)' },
        { char: 'છીએ', romaji: 'chīe', meaning: 'are (we are)', frequency: 5, example: 'અમે મિત્રો છીએ (We are friends)' },

        // Common verbs - conjugated forms
        { char: 'જવું', romaji: 'javuṃ', meaning: 'to go', frequency: 6, example: 'હું શાળાએ જાઉં છું (I go to school)' },
        { char: 'જાઉં', romaji: 'jāuṃ', meaning: 'go (I go)', frequency: 7, example: 'હું જાઉં છું (I am going)' },
        { char: 'જાઓ', romaji: 'jāo', meaning: 'go (you go)', frequency: 8, example: 'તમે જાઓ (You go)' },
        { char: 'જાય', romaji: 'jāy', meaning: 'go (he/she goes)', frequency: 9, example: 'તે જાય છે (He/she goes)' },

        { char: 'આવવું', romaji: 'āvavuṃ', meaning: 'to come', frequency: 10, example: 'તમે આવો (You come)' },
        { char: 'આવું', romaji: 'āvuṃ', meaning: 'come (I come)', frequency: 11, example: 'હું આવું છું (I am coming)' },
        { char: 'આવે', romaji: 'āve', meaning: 'come (he/she comes)', frequency: 12, example: 'તે આવે છે (He/she comes)' },

        { char: 'ખાવું', romaji: 'khāvuṃ', meaning: 'to eat', frequency: 13, example: 'હું રોટલી ખાઉં છું (I eat bread)' },
        { char: 'ખાઉં', romaji: 'khāuṃ', meaning: 'eat (I eat)', frequency: 14, example: 'હું ખાઉં છું (I am eating)' },
        { char: 'ખાય', romaji: 'khāy', meaning: 'eat (he/she eats)', frequency: 15, example: 'તે ખાય છે (He/she eats)' },

        { char: 'પીવું', romaji: 'pīvuṃ', meaning: 'to drink', frequency: 16, example: 'હું ચા પીઉં છું (I drink tea)' },
        { char: 'પીઉં', romaji: 'pīuṃ', meaning: 'drink (I drink)', frequency: 17, example: 'હું પાણી પીઉં છું (I drink water)' },
        { char: 'પીએ', romaji: 'pīe', meaning: 'drink (he/she drinks)', frequency: 18, example: 'તે પીએ છે (He/she drinks)' },

        { char: 'બોલવું', romaji: 'bolavuṃ', meaning: 'to speak', frequency: 19, example: 'હું ગુજરાતી બોલું છું (I speak Gujarati)' },
        { char: 'બોલું', romaji: 'boluṃ', meaning: 'speak (I speak)', frequency: 20, example: 'હું બોલું છું (I am speaking)' },
        { char: 'બોલે', romaji: 'bole', meaning: 'speak (he/she speaks)', frequency: 21, example: 'તે બોલે છે (He/she speaks)' },

        { char: 'વાંચવું', romaji: 'vāṃcavuṃ', meaning: 'to read', frequency: 22, example: 'હું પુસ્તક વાંચું છું (I read a book)' },
        { char: 'લખવું', romaji: 'lakhavuṃ', meaning: 'to write', frequency: 23, example: 'હું પત્ર લખું છું (I write a letter)' },
        { char: 'જોવું', romaji: 'jovuṃ', meaning: 'to see, to watch', frequency: 24, example: 'હું ટીવી જોઉં છું (I watch TV)' },
        { char: 'સાંભળવું', romaji: 'sāṃbhaḷavuṃ', meaning: 'to listen, to hear', frequency: 25, example: 'હું સંગીત સાંભળું છું (I listen to music)' },
        { char: 'સમજવું', romaji: 'samajavuṃ', meaning: 'to understand', frequency: 26, example: 'હવે હું સમજ્યો (Now I understand)' },
        { char: 'શીખવું', romaji: 'śīkhavuṃ', meaning: 'to learn', frequency: 27, example: 'હું ગુજરાતી શીખું છું (I am learning Gujarati)' },
        { char: 'ખરીદવું', romaji: 'kharīdavuṃ', meaning: 'to buy', frequency: 28, example: 'હું પાવ ખરીદું છું (I buy bread)' },
        { char: 'વેચવું', romaji: 'vecavuṃ', meaning: 'to sell', frequency: 29, example: 'તે ફળ વેચે છે (He sells fruits)' },
        { char: 'રાહ જોવું', romaji: 'rāh jovuṃ', meaning: 'to wait', frequency: 30, example: 'હું બસની રાહ જોઉં છું (I wait for the bus)' },

        // Common nouns
        { char: 'પાણી', romaji: 'pāṇī', meaning: 'water', frequency: 31, example: 'મને પાણી જોઈએ (I need water)' },
        { char: 'ઘર', romaji: 'ghar', meaning: 'house, home', frequency: 32, example: 'આ મારું ઘર છે (This is my house)' },
        { char: 'શાળા', romaji: 'śāḷā', meaning: 'school', frequency: 33, example: 'બાળકો શાળામાં જાય છે (Children go to school)' },
        { char: 'પુસ્તક', romaji: 'pustak', meaning: 'book', frequency: 34, example: 'હું પુસ્તક વાંચું છું (I read a book)' },
        { char: 'મિત્ર', romaji: 'mitra', meaning: 'friend', frequency: 35, example: 'તે મારો મિત્ર છે (He is my friend)' },
        { char: 'કુટુંબ', romaji: 'kuṭuṃba', meaning: 'family', frequency: 36, example: 'મારું કુટુંબ મોટું છે (My family is big)' },
        { char: 'સમય', romaji: 'samay', meaning: 'time', frequency: 37, example: 'સમય શું થયો? (What time is it?)' },
        { char: 'દિવસ', romaji: 'divas', meaning: 'day', frequency: 38, example: 'આજે સારો દિવસ છે (Today is a good day)' },
        { char: 'રાત', romaji: 'rāt', meaning: 'night', frequency: 39, example: 'શુભ રાત્રિ (Good night)' },
        { char: 'સવાર', romaji: 'savār', meaning: 'morning', frequency: 40, example: 'સુપ્રભાત (Good morning)' },

        // Common adjectives
        { char: 'મોટું', romaji: 'moṭuṃ', meaning: 'big', frequency: 41, example: 'મોટું ઘર (big house)' },
        { char: 'નાનું', romaji: 'nānuṃ', meaning: 'small', frequency: 42, example: 'નાનું કૂતરું (small dog)' },
        { char: 'સારું', romaji: 'sāruṃ', meaning: 'good', frequency: 43, example: 'સારી રીતે (in a good way)' },
        { char: 'ખરાબ', romaji: 'kharāb', meaning: 'bad', frequency: 44, example: 'ખરાબ માણસ (bad person)' },
        { char: 'નવું', romaji: 'navuṃ', meaning: 'new', frequency: 45, example: 'નવું પુસ્તક (new book)' },
        { char: 'જૂનું', romaji: 'jūnuṃ', meaning: 'old (things)', frequency: 46, example: 'જૂનું ઘર (old house)' },
        { char: 'ઊંચું', romaji: 'ūṃcuṃ', meaning: 'tall, high', frequency: 47, example: 'ઊંચી બિલ્ડિંગ (tall building)' },
        { char: 'નીચું', romaji: 'nīcuṃ', meaning: 'low, short', frequency: 48, example: 'નીચું ટેબલ (low table)' },
        { char: 'સુંદર', romaji: 'sundar', meaning: 'beautiful', frequency: 49, example: 'સુંદર ફૂલ (beautiful flower)' },
        { char: 'સ્વાદિષ્ટ', romaji: 'svādiṣṭ', meaning: 'delicious', frequency: 50, example: 'સ્વાદિષ્ટ ખોરાક (delicious food)' },

        // Greetings and common phrases
        { char: 'નમસ્તે', romaji: 'namaste', meaning: 'hello, greetings', frequency: 51, example: 'નમસ્તે! તમે કેમ છો?' },
        { char: 'આભાર', romaji: 'ābhār', meaning: 'thank you', frequency: 52, example: 'તમારો આભાર' },
        { char: 'હા', romaji: 'hā', meaning: 'yes', frequency: 53, example: 'હા, બરાબર છે' },
        { char: 'ના', romaji: 'nā', meaning: 'no', frequency: 54, example: 'ના, તે યોગ્ય નથી' },
        { char: 'માફ કરશો', romaji: 'māf karśo', meaning: 'sorry, excuse me', frequency: 55, example: 'માફ કરશો, હું સમજ્યો નહીં' },
        { char: 'કૃપા કરીને', romaji: 'kṛpā karīne', meaning: 'please', frequency: 56, example: 'કૃપા કરીને મને મદદ કરો' },
        { char: 'સુપ્રભાત', romaji: 'suprabhāt', meaning: 'good morning', frequency: 57, example: 'Morning greeting' },
        { char: 'શુભ રાત્રિ', romaji: 'śubh rātri', meaning: 'good night', frequency: 58, example: 'Night greeting' },
        { char: 'ફરી મળીશું', romaji: 'phari maḷīśuṃ', meaning: 'see you again', frequency: 59, example: 'Goodbye phrase' },
        { char: 'સ્વાગત', romaji: 'svāgat', meaning: 'welcome', frequency: 60, example: 'સ્વાગત છે (You\'re welcome)' },

        // Family members
        { char: 'માતા', romaji: 'mātā', meaning: 'mother', frequency: 61, example: 'મારી માતા (my mother)' },
        { char: 'પિતા', romaji: 'pitā', meaning: 'father', frequency: 62, example: 'મારા પિતા (my father)' },
        { char: 'ભાઈ', romaji: 'bhāī', meaning: 'brother', frequency: 63, example: 'મારો ભાઈ (my brother)' },
        { char: 'બહેન', romaji: 'bahen', meaning: 'sister', frequency: 64, example: 'મારી બહેન (my sister)' },
        { char: 'દીકરો', romaji: 'dīkaro', meaning: 'son', frequency: 65, example: 'મારો દીકરો (my son)' },
        { char: 'દીકરી', romaji: 'dīkarī', meaning: 'daughter', frequency: 66, example: 'મારી દીકરી (my daughter)' },

        // Body parts
        { char: 'માથું', romaji: 'māthuṃ', meaning: 'head', frequency: 67, example: 'મારું માથું દુખે છે (My head hurts)' },
        { char: 'આંખ', romaji: 'āṃkh', meaning: 'eye', frequency: 68, example: 'બે આંખો (two eyes)' },
        { char: 'હાથ', romaji: 'hāth', meaning: 'hand', frequency: 69, example: 'હાથ ધોવા (to wash hands)' },
        { char: 'પગ', romaji: 'pag', meaning: 'foot, leg', frequency: 70, example: 'મારો પગ (my foot)' }
    ],

    sentences: [
        // Being sentences - છે
        { char: 'હું વિદ્યાર્થી છું', romaji: 'huṃ vidyārthī chuṃ', meaning: 'I am a student', frequency: 1, example: 'Self-introduction' },
        { char: 'તમે કેમ છો?', romaji: 'tame kem cho?', meaning: 'How are you?', frequency: 2, example: 'Greeting question' },
        { char: 'હું સારો છું', romaji: 'huṃ sāro chuṃ', meaning: 'I am fine/good', frequency: 3, example: 'Response to greeting' },
        { char: 'તે અહીં છે', romaji: 'te ahīṃ che', meaning: 'He/she is here', frequency: 4, example: 'Location statement' },
        { char: 'અમે મિત્રો છીએ', romaji: 'ame mitro chīe', meaning: 'We are friends', frequency: 5, example: 'Relationship' },
        { char: 'આ મારું ઘર છે', romaji: 'ā māruṃ ghar che', meaning: 'This is my house', frequency: 6, example: 'Possession' },
        { char: 'તે ડૉક્ટર છે', romaji: 'te ḍokṭar che', meaning: 'He/she is a doctor', frequency: 7, example: 'Profession' },

        // Going - જવું
        { char: 'હું શાળાએ જાઉં છું', romaji: 'huṃ śāḷāe jāuṃ chuṃ', meaning: 'I go to school', frequency: 8, example: 'Going to place' },
        { char: 'તમે ક્યાં જાઓ છો?', romaji: 'tame kyāṃ jāo cho?', meaning: 'Where are you going?', frequency: 9, example: 'Question about destination' },
        { char: 'તે બજારે જાય છે', romaji: 'te bajāre jāy che', meaning: 'He/she goes to the market', frequency: 10, example: 'Regular action' },
        { char: 'હું આવતીકાલે જઈશ', romaji: 'huṃ āvatīkāle jaīś', meaning: 'I will go tomorrow', frequency: 11, example: 'Future action' },
        { char: 'અમે પાર્કમાં જઈએ', romaji: 'ame pārkamāṃ jaīe', meaning: 'We go to the park', frequency: 12, example: 'Group going' },

        // Coming - આવવું
        { char: 'તમે આવો', romaji: 'tame āvo', meaning: 'You come / Please come', frequency: 13, example: 'Invitation' },
        { char: 'હું અત્યારે આવું છું', romaji: 'huṃ atyāre āvuṃ chuṃ', meaning: 'I am coming now', frequency: 14, example: 'Present continuous' },
        { char: 'તે આવશે', romaji: 'te āvaśe', meaning: 'He/she will come', frequency: 15, example: 'Future action' },
        { char: 'મારો મિત્ર આવે છે', romaji: 'māro mitra āve che', meaning: 'My friend comes', frequency: 16, example: 'Regular visitor' },

        // Eating - ખાવું
        { char: 'હું રોટલી ખાઉં છું', romaji: 'huṃ roṭalī khāuṃ chuṃ', meaning: 'I eat bread', frequency: 17, example: 'Eating food' },
        { char: 'તમે શું ખાઓ છો?', romaji: 'tame śuṃ khāo cho?', meaning: 'What are you eating?', frequency: 18, example: 'Question about food' },
        { char: 'તે ફળ ખાય છે', romaji: 'te phaḷ khāy che', meaning: 'He/she eats fruit', frequency: 19, example: 'Eating habit' },
        { char: 'અમે સાથે ખાઈએ', romaji: 'ame sāthe khāīe', meaning: 'We eat together', frequency: 20, example: 'Group eating' },
        { char: 'મને ભૂખ લાગી છે', romaji: 'mane bhūkh lāgī che', meaning: 'I am hungry', frequency: 21, example: 'Expressing hunger' },

        // Drinking - પીવું
        { char: 'હું પાણી પીઉં છું', romaji: 'huṃ pāṇī pīuṃ chuṃ', meaning: 'I drink water', frequency: 22, example: 'Drinking liquid' },
        { char: 'તમે ચા પીશો?', romaji: 'tame cā pīśo?', meaning: 'Will you drink tea?', frequency: 23, example: 'Offering drink' },
        { char: 'તે દૂધ પીએ છે', romaji: 'te dūdh pīe che', meaning: 'He/she drinks milk', frequency: 24, example: 'Drinking habit' },
        { char: 'મને તરસ લાગી છે', romaji: 'mane taras lāgī che', meaning: 'I am thirsty', frequency: 25, example: 'Expressing thirst' },

        // Speaking - બોલવું
        { char: 'હું ગુજરાતી બોલું છું', romaji: 'huṃ gujarātī boluṃ chuṃ', meaning: 'I speak Gujarati', frequency: 26, example: 'Language ability' },
        { char: 'તમે અંગ્રેજી બોલો છો?', romaji: 'tame aṃgrejī bolo cho?', meaning: 'Do you speak English?', frequency: 27, example: 'Language question' },
        { char: 'તે ઝડપથી બોલે છે', romaji: 'te jhaḍapathī bole che', meaning: 'He/she speaks quickly', frequency: 28, example: 'Manner of speaking' },
        { char: 'કૃપા કરીને ધીમે બોલો', romaji: 'kṛpā karīne dhīme bolo', meaning: 'Please speak slowly', frequency: 29, example: 'Request' },

        // Reading and writing
        { char: 'હું પુસ્તક વાંચું છું', romaji: 'huṃ pustak vāṃcuṃ chuṃ', meaning: 'I read a book', frequency: 30, example: 'Reading action' },
        { char: 'તમે શું વાંચો છો?', romaji: 'tame śuṃ vāṃco cho?', meaning: 'What are you reading?', frequency: 31, example: 'Question about reading' },
        { char: 'હું પત્ર લખું છું', romaji: 'huṃ patra lakhuṃ chuṃ', meaning: 'I write a letter', frequency: 32, example: 'Writing action' },
        { char: 'તે ગુજરાતી લખી શકે છે', romaji: 'te gujarātī lakhī śake che', meaning: 'He/she can write Gujarati', frequency: 33, example: 'Ability' },

        // Seeing and watching
        { char: 'હું ટીવી જોઉં છું', romaji: 'huṃ ṭīvī jouṃ chuṃ', meaning: 'I watch TV', frequency: 34, example: 'Watching' },
        { char: 'તમે શું જુઓ છો?', romaji: 'tame śuṃ juo cho?', meaning: 'What are you watching?', frequency: 35, example: 'Question' },
        { char: 'તે ફિલ્મ જોવા જાય છે', romaji: 'te philm jovā jāy che', meaning: 'He/she goes to watch a movie', frequency: 36, example: 'Activity' },

        // Listening and hearing
        { char: 'હું સંગીત સાંભળું છું', romaji: 'huṃ saṃgīt sāṃbhaḷuṃ chuṃ', meaning: 'I listen to music', frequency: 37, example: 'Listening' },
        { char: 'તમે સાંભળ્યું?', romaji: 'tame sāṃbhaḷyuṃ?', meaning: 'Did you hear?', frequency: 38, example: 'Past question' },

        // Understanding and learning
        { char: 'હું સમજ્યો', romaji: 'huṃ samajyo', meaning: 'I understood', frequency: 39, example: 'Past tense understanding' },
        { char: 'મને સમજાયું નહીં', romaji: 'mane samajāyuṃ nahīṃ', meaning: 'I didn\'t understand', frequency: 40, example: 'Negative past' },
        { char: 'હું ગુજરાતી શીખું છું', romaji: 'huṃ gujarātī śīkhuṃ chuṃ', meaning: 'I am learning Gujarati', frequency: 41, example: 'Learning process' },
        { char: 'તમે ક્યાંથી શીખ્યા?', romaji: 'tame kyāṃthī śīkhyā?', meaning: 'Where did you learn?', frequency: 42, example: 'Past question' },

        // Shopping and buying
        { char: 'હું પાવ ખરીદું છું', romaji: 'huṃ pāv kharīduṃ chuṃ', meaning: 'I buy bread', frequency: 43, example: 'Shopping' },
        { char: 'આ કેટલું છે?', romaji: 'ā keṭaluṃ che?', meaning: 'How much is this?', frequency: 44, example: 'Price question' },
        { char: 'તે ખૂબ મોંઘું છે', romaji: 'te khūb moṃghuṃ che', meaning: 'It is very expensive', frequency: 45, example: 'Price comment' },
        { char: 'આ સ્વસ્તું છે', romaji: 'ā svastuṃ che', meaning: 'This is cheap', frequency: 46, example: 'Price description' },

        // Questions and answers
        { char: 'તમારું નામ શું છે?', romaji: 'tamāruṃ nām śuṃ che?', meaning: 'What is your name?', frequency: 47, example: 'Name question' },
        { char: 'મારું નામ... છે', romaji: 'māruṃ nām... che', meaning: 'My name is...', frequency: 48, example: 'Name response' },
        { char: 'તમે ક્યાંથી આવો છો?', romaji: 'tame kyāṃthī āvo cho?', meaning: 'Where are you from?', frequency: 49, example: 'Origin question' },
        { char: 'હું... થી આવું છું', romaji: 'huṃ... thī āvuṃ chuṃ', meaning: 'I am from...', frequency: 50, example: 'Origin response' },
        { char: 'સમય શું થયો?', romaji: 'samay śuṃ thayo?', meaning: 'What time is it?', frequency: 51, example: 'Time question' },
        { char: 'અત્યારે ત્રણ વાગ્યા છે', romaji: 'atyāre traṇ vāgyā che', meaning: 'It is three o\'clock now', frequency: 52, example: 'Time answer' },

        // Location and directions
        { char: 'શૌચાલય ક્યાં છે?', romaji: 'śaucālay kyāṃ che?', meaning: 'Where is the toilet?', frequency: 53, example: 'Location question' },
        { char: 'સ્ટેશન ક્યાં છે?', romaji: 'sṭeśan kyāṃ che?', meaning: 'Where is the station?', frequency: 54, example: 'Asking directions' },
        { char: 'તે ત્યાં છે', romaji: 'te tyāṃ che', meaning: 'It is over there', frequency: 55, example: 'Pointing direction' },

        // Adjective sentences
        { char: 'આ ઘર મોટું છે', romaji: 'ā ghar moṭuṃ che', meaning: 'This house is big', frequency: 56, example: 'Size description' },
        { char: 'તે પુસ્તક નાનું છે', romaji: 'te pustak nānuṃ che', meaning: 'That book is small', frequency: 57, example: 'Size description' },
        { char: 'આ ખોરાક સ્વાદિષ્ટ છે', romaji: 'ā khorāk svādiṣṭ che', meaning: 'This food is delicious', frequency: 58, example: 'Taste description' },
        { char: 'તે ખૂબ સુંદર છે', romaji: 'te khūb sundar che', meaning: 'It is very beautiful', frequency: 59, example: 'Appearance description' },
        { char: 'ગુજરાતી સરળ છે', romaji: 'gujarātī saraḷ che', meaning: 'Gujarati is easy', frequency: 60, example: 'Difficulty description' },

        // More practical sentences
        { char: 'કૃપા કરીને મને મદદ કરો', romaji: 'kṛpā karīne mane madad karo', meaning: 'Please help me', frequency: 61, example: 'Request for help' },
        { char: 'તમારો દિવસ શુભ હો', romaji: 'tamāro divas śubh ho', meaning: 'Have a good day', frequency: 62, example: 'Well-wishing' },
        { char: 'તમે ક્યાં રહો છો?', romaji: 'tame kyāṃ raho cho?', meaning: 'Where do you live?', frequency: 63, example: 'Residence question' },
        { char: 'હું... માં રહું છું', romaji: 'huṃ... māṃ rahuṃ chuṃ', meaning: 'I live in...', frequency: 64, example: 'Residence answer' },
        { char: 'તમારી ઉંમર કેટલી છે?', romaji: 'tamārī uṃmar keṭalī che?', meaning: 'How old are you?', frequency: 65, example: 'Age question' },
        { char: 'મારી ઉંમર... વર્ષ છે', romaji: 'mārī uṃmar... varṣ che', meaning: 'I am... years old', frequency: 66, example: 'Age response' },
        { char: 'આજે ગરમી છે', romaji: 'āje garamī che', meaning: 'Today is hot', frequency: 67, example: 'Weather comment' },
        { char: 'આવતીકાલે વરસાદ પડશે', romaji: 'āvatīkāle varasād paḍaśe', meaning: 'It will rain tomorrow', frequency: 68, example: 'Weather prediction' },
        { char: 'હું થાકી ગયો છું', romaji: 'huṃ thākī gayo chuṃ', meaning: 'I am tired', frequency: 69, example: 'Physical state' },
        { char: 'તે ખુશ છે', romaji: 'te khuś che', meaning: 'He/she is happy', frequency: 70, example: 'Emotional state' }
    ]
};

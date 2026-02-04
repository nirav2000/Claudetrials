// French Learning Data
// Comprehensive data for learning French with spaced repetition

const frenchData = {
    alphabet: [
        // Basic French alphabet
        { char: 'a', romaji: 'a', meaning: 'letter a', frequency: 1, example: 'ami (friend)' },
        { char: 'b', romaji: 'b', meaning: 'letter b', frequency: 2, example: 'bon (good)' },
        { char: 'c', romaji: 'c', meaning: 'letter c', frequency: 3, example: 'chat (cat)' },
        { char: 'd', romaji: 'd', meaning: 'letter d', frequency: 4, example: 'dans (in)' },
        { char: 'e', romaji: 'e', meaning: 'letter e', frequency: 5, example: 'et (and)' },
        { char: 'f', romaji: 'f', meaning: 'letter f', frequency: 6, example: 'faire (to do)' },
        { char: 'g', romaji: 'g', meaning: 'letter g', frequency: 7, example: 'grand (big)' },
        { char: 'h', romaji: 'h', meaning: 'letter h', frequency: 8, example: 'homme (man)' },
        { char: 'i', romaji: 'i', meaning: 'letter i', frequency: 9, example: 'il (he)' },
        { char: 'j', romaji: 'j', meaning: 'letter j', frequency: 10, example: 'je (I)' },
        { char: 'k', romaji: 'k', meaning: 'letter k', frequency: 11, example: 'kilo' },
        { char: 'l', romaji: 'l', meaning: 'letter l', frequency: 12, example: 'le (the)' },
        { char: 'm', romaji: 'm', meaning: 'letter m', frequency: 13, example: 'moi (me)' },
        { char: 'n', romaji: 'n', meaning: 'letter n', frequency: 14, example: 'non (no)' },
        { char: 'o', romaji: 'o', meaning: 'letter o', frequency: 15, example: 'ou (or)' },
        { char: 'p', romaji: 'p', meaning: 'letter p', frequency: 16, example: 'pour (for)' },
        { char: 'q', romaji: 'q', meaning: 'letter q', frequency: 17, example: 'que (that)' },
        { char: 'r', romaji: 'r', meaning: 'letter r', frequency: 18, example: 'rue (street)' },
        { char: 's', romaji: 's', meaning: 'letter s', frequency: 19, example: 'si (if)' },
        { char: 't', romaji: 't', meaning: 'letter t', frequency: 20, example: 'tu (you)' },
        { char: 'u', romaji: 'u', meaning: 'letter u', frequency: 21, example: 'un (one)' },
        { char: 'v', romaji: 'v', meaning: 'letter v', frequency: 22, example: 'vous (you)' },
        { char: 'w', romaji: 'w', meaning: 'letter w', frequency: 23, example: 'weekend' },
        { char: 'x', romaji: 'x', meaning: 'letter x', frequency: 24, example: 'exemple (example)' },
        { char: 'y', romaji: 'y', meaning: 'letter y', frequency: 25, example: 'yeux (eyes)' },
        { char: 'z', romaji: 'z', meaning: 'letter z', frequency: 26, example: 'zéro (zero)' },
        // Accented characters
        { char: 'é', romaji: 'é (e acute)', meaning: 'accented e', frequency: 27, example: 'café, été' },
        { char: 'è', romaji: 'è (e grave)', meaning: 'accented e', frequency: 28, example: 'père, mère' },
        { char: 'ê', romaji: 'ê (e circumflex)', meaning: 'accented e', frequency: 29, example: 'être, fête' },
        { char: 'ë', romaji: 'ë (e diaeresis)', meaning: 'accented e', frequency: 30, example: 'Noël' },
        { char: 'à', romaji: 'à (a grave)', meaning: 'accented a', frequency: 31, example: 'à, voilà' },
        { char: 'â', romaji: 'â (a circumflex)', meaning: 'accented a', frequency: 32, example: 'pâte' },
        { char: 'ù', romaji: 'ù (u grave)', meaning: 'accented u', frequency: 33, example: 'où' },
        { char: 'û', romaji: 'û (u circumflex)', meaning: 'accented u', frequency: 34, example: 'sûr' },
        { char: 'ô', romaji: 'ô (o circumflex)', meaning: 'accented o', frequency: 35, example: 'hôtel' },
        { char: 'î', romaji: 'î (i circumflex)', meaning: 'accented i', frequency: 36, example: 'île' },
        { char: 'ï', romaji: 'ï (i diaeresis)', meaning: 'accented i', frequency: 37, example: 'maïs' },
        { char: 'ç', romaji: 'ç (c cedilla)', meaning: 'c with cedilla', frequency: 38, example: 'français, garçon' },
        { char: 'œ', romaji: 'œ (oe ligature)', meaning: 'oe ligature', frequency: 39, example: 'cœur, sœur' },
        { char: 'æ', romaji: 'æ (ae ligature)', meaning: 'ae ligature', frequency: 40, example: 'ex æquo' }
    ],

    numbers: [
        { char: 'zéro', romaji: 'zay-roh', meaning: 'zero', frequency: 1, category: 'numbers', example: 'zéro degré (zero degrees)' },
        { char: 'un', romaji: 'uhn', meaning: 'one', frequency: 2, category: 'numbers', example: 'un chat (one cat)' },
        { char: 'deux', romaji: 'duh', meaning: 'two', frequency: 3, category: 'numbers', example: 'deux pommes (two apples)' },
        { char: 'trois', romaji: 'twah', meaning: 'three', frequency: 4, category: 'numbers', example: 'trois livres (three books)' },
        { char: 'quatre', romaji: 'katr', meaning: 'four', frequency: 5, category: 'numbers', example: 'quatre ans (four years)' },
        { char: 'cinq', romaji: 'sank', meaning: 'five', frequency: 6, category: 'numbers', example: 'cinq euros (five euros)' },
        { char: 'six', romaji: 'sees', meaning: 'six', frequency: 7, category: 'numbers', example: 'six heures (six o\'clock)' },
        { char: 'sept', romaji: 'set', meaning: 'seven', frequency: 8, category: 'numbers', example: 'sept jours (seven days)' },
        { char: 'huit', romaji: 'weet', meaning: 'eight', frequency: 9, category: 'numbers', example: 'huit personnes (eight people)' },
        { char: 'neuf', romaji: 'nuhf', meaning: 'nine', frequency: 10, category: 'numbers', example: 'neuf mois (nine months)' },
        { char: 'dix', romaji: 'dees', meaning: 'ten', frequency: 11, category: 'numbers', example: 'dix minutes (ten minutes)' },
        { char: 'vingt', romaji: 'van', meaning: 'twenty', frequency: 12, category: 'numbers', example: 'vingt ans (twenty years)' },
        { char: 'cent', romaji: 'sahn', meaning: 'hundred', frequency: 13, category: 'numbers', example: 'cent euros (one hundred euros)' },
        { char: 'mille', romaji: 'meel', meaning: 'thousand', frequency: 14, category: 'numbers', example: 'mille personnes (one thousand people)' }
    ],

    colors: [
        { char: 'rouge', romaji: 'roozh', meaning: 'red', frequency: 1, category: 'colors', example: 'une voiture rouge (a red car)' },
        { char: 'bleu', romaji: 'bluh', meaning: 'blue', frequency: 2, category: 'colors', example: 'le ciel bleu (the blue sky)' },
        { char: 'vert', romaji: 'vehr', meaning: 'green', frequency: 3, category: 'colors', example: 'l\'herbe verte (green grass)' },
        { char: 'jaune', romaji: 'zhohn', meaning: 'yellow', frequency: 4, category: 'colors', example: 'le soleil jaune (yellow sun)' },
        { char: 'noir', romaji: 'nwahr', meaning: 'black', frequency: 5, category: 'colors', example: 'un chat noir (a black cat)' },
        { char: 'blanc', romaji: 'blahn', meaning: 'white', frequency: 6, category: 'colors', example: 'la neige blanche (white snow)' },
        { char: 'orange', romaji: 'oh-rahnzh', meaning: 'orange', frequency: 7, category: 'colors', example: 'une orange orange (an orange orange)' },
        { char: 'rose', romaji: 'rohz', meaning: 'pink', frequency: 8, category: 'colors', example: 'une fleur rose (a pink flower)' },
        { char: 'violet', romaji: 'vee-oh-leh', meaning: 'purple', frequency: 9, category: 'colors', example: 'une robe violette (a purple dress)' },
        { char: 'gris', romaji: 'gree', meaning: 'gray', frequency: 10, category: 'colors', example: 'un nuage gris (a gray cloud)' },
        { char: 'marron', romaji: 'mah-rohn', meaning: 'brown', frequency: 11, category: 'colors', example: 'des chaussures marron (brown shoes)' }
    ],

    words: [
        // Essential verbs - être (to be)
        { char: 'être', romaji: 'eh-truh', meaning: 'to be', frequency: 1, example: 'Je suis étudiant (I am a student)' },
        { char: 'suis', romaji: 'swee', meaning: 'am (I am)', frequency: 2, example: 'Je suis content (I am happy)' },
        { char: 'es', romaji: 'eh', meaning: 'are (you are)', frequency: 3, example: 'Tu es français (You are French)' },
        { char: 'est', romaji: 'eh', meaning: 'is (he/she/it is)', frequency: 4, example: 'Il est grand (He is tall)' },
        { char: 'sommes', romaji: 'sohm', meaning: 'are (we are)', frequency: 5, example: 'Nous sommes amis (We are friends)' },
        { char: 'êtes', romaji: 'et', meaning: 'are (you are - formal)', frequency: 6, example: 'Vous êtes gentil (You are kind)' },
        { char: 'sont', romaji: 'sohn', meaning: 'are (they are)', frequency: 7, example: 'Ils sont ici (They are here)' },

        // Essential verbs - avoir (to have)
        { char: 'avoir', romaji: 'ah-vwahr', meaning: 'to have', frequency: 8, example: 'J\'ai un chat (I have a cat)' },
        { char: 'ai', romaji: 'eh', meaning: 'have (I have)', frequency: 9, example: 'J\'ai faim (I am hungry)' },
        { char: 'as', romaji: 'ah', meaning: 'have (you have)', frequency: 10, example: 'Tu as raison (You are right)' },
        { char: 'a', romaji: 'ah', meaning: 'has (he/she/it has)', frequency: 11, example: 'Elle a un livre (She has a book)' },
        { char: 'avons', romaji: 'ah-vohn', meaning: 'have (we have)', frequency: 12, example: 'Nous avons du temps (We have time)' },
        { char: 'avez', romaji: 'ah-vay', meaning: 'have (you have - formal)', frequency: 13, example: 'Vous avez tort (You are wrong)' },
        { char: 'ont', romaji: 'ohn', meaning: 'have (they have)', frequency: 14, example: 'Ils ont soif (They are thirsty)' },

        // Common verbs - aller (to go)
        { char: 'aller', romaji: 'ah-lay', meaning: 'to go', frequency: 15, example: 'Je vais à l\'école (I go to school)' },
        { char: 'vais', romaji: 'veh', meaning: 'go (I go)', frequency: 16, example: 'Je vais bien (I am doing well)' },
        { char: 'vas', romaji: 'vah', meaning: 'go (you go)', frequency: 17, example: 'Tu vas où? (Where are you going?)' },
        { char: 'va', romaji: 'vah', meaning: 'goes (he/she/it goes)', frequency: 18, example: 'Il va au parc (He goes to the park)' },
        { char: 'allons', romaji: 'ah-lohn', meaning: 'go (we go)', frequency: 19, example: 'Nous allons danser (We are going to dance)' },
        { char: 'allez', romaji: 'ah-lay', meaning: 'go (you go - formal)', frequency: 20, example: 'Vous allez bien? (Are you well?)' },
        { char: 'vont', romaji: 'vohn', meaning: 'go (they go)', frequency: 21, example: 'Ils vont partir (They are going to leave)' },

        // Common verbs - faire (to do/make)
        { char: 'faire', romaji: 'fehr', meaning: 'to do, to make', frequency: 22, example: 'Je fais mes devoirs (I do my homework)' },
        { char: 'fais', romaji: 'feh', meaning: 'do/make (I do)', frequency: 23, example: 'Je fais du sport (I do sports)' },
        { char: 'fait', romaji: 'feh', meaning: 'does/makes (he/she does)', frequency: 24, example: 'Il fait beau (The weather is nice)' },
        { char: 'faisons', romaji: 'fuh-zohn', meaning: 'do/make (we do)', frequency: 25, example: 'Nous faisons attention (We pay attention)' },
        { char: 'faites', romaji: 'fet', meaning: 'do/make (you do - formal)', frequency: 26, example: 'Vous faites quoi? (What are you doing?)' },
        { char: 'font', romaji: 'fohn', meaning: 'do/make (they do)', frequency: 27, example: 'Ils font la cuisine (They are cooking)' },

        // Other common verbs
        { char: 'parler', romaji: 'par-lay', meaning: 'to speak', frequency: 28, example: 'Je parle français (I speak French)' },
        { char: 'manger', romaji: 'mahn-zhay', meaning: 'to eat', frequency: 29, example: 'Je mange du pain (I eat bread)' },
        { char: 'boire', romaji: 'bwahr', meaning: 'to drink', frequency: 30, example: 'Je bois de l\'eau (I drink water)' },
        { char: 'voir', romaji: 'vwahr', meaning: 'to see', frequency: 31, example: 'Je vois la mer (I see the sea)' },
        { char: 'venir', romaji: 'vuh-neer', meaning: 'to come', frequency: 32, example: 'Je viens demain (I am coming tomorrow)' },
        { char: 'prendre', romaji: 'prahn-druh', meaning: 'to take', frequency: 33, example: 'Je prends le bus (I take the bus)' },
        { char: 'comprendre', romaji: 'kohm-prahn-druh', meaning: 'to understand', frequency: 34, example: 'Je comprends maintenant (I understand now)' },
        { char: 'donner', romaji: 'doh-nay', meaning: 'to give', frequency: 35, example: 'Je donne un cadeau (I give a gift)' },
        { char: 'savoir', romaji: 'sah-vwahr', meaning: 'to know (facts)', frequency: 36, example: 'Je sais nager (I know how to swim)' },
        { char: 'connaître', romaji: 'koh-neh-truh', meaning: 'to know (people/places)', frequency: 37, example: 'Je connais Paris (I know Paris)' },
        { char: 'vouloir', romaji: 'voo-lwahr', meaning: 'to want', frequency: 38, example: 'Je veux un café (I want a coffee)' },
        { char: 'pouvoir', romaji: 'poo-vwahr', meaning: 'to be able to, can', frequency: 39, example: 'Je peux t\'aider (I can help you)' },
        { char: 'devoir', romaji: 'duh-vwahr', meaning: 'must, to have to', frequency: 40, example: 'Je dois partir (I must leave)' },

        // Common nouns
        { char: 'maison', romaji: 'meh-zohn', meaning: 'house', frequency: 41, example: 'une grande maison (a big house)' },
        { char: 'famille', romaji: 'fah-mee', meaning: 'family', frequency: 42, example: 'ma famille (my family)' },
        { char: 'ami', romaji: 'ah-mee', meaning: 'friend (masculine)', frequency: 43, example: 'mon ami (my friend)' },
        { char: 'amie', romaji: 'ah-mee', meaning: 'friend (feminine)', frequency: 44, example: 'mon amie (my friend)' },
        { char: 'temps', romaji: 'tahn', meaning: 'time, weather', frequency: 45, example: 'le temps passe (time passes)' },
        { char: 'jour', romaji: 'zhoor', meaning: 'day', frequency: 46, example: 'chaque jour (every day)' },
        { char: 'vie', romaji: 'vee', meaning: 'life', frequency: 47, example: 'la vie est belle (life is beautiful)' },
        { char: 'chose', romaji: 'shohz', meaning: 'thing', frequency: 48, example: 'quelque chose (something)' },
        { char: 'monde', romaji: 'mohnd', meaning: 'world', frequency: 49, example: 'le monde entier (the whole world)' },
        { char: 'travail', romaji: 'trah-vahy', meaning: 'work', frequency: 50, example: 'mon travail (my work)' },

        // Common adjectives
        { char: 'bon', romaji: 'bohn', meaning: 'good (masculine)', frequency: 51, example: 'un bon livre (a good book)' },
        { char: 'bonne', romaji: 'bohn', meaning: 'good (feminine)', frequency: 52, example: 'une bonne idée (a good idea)' },
        { char: 'grand', romaji: 'grahn', meaning: 'big, tall (masculine)', frequency: 53, example: 'un grand homme (a tall man)' },
        { char: 'grande', romaji: 'grahnd', meaning: 'big, tall (feminine)', frequency: 54, example: 'une grande maison (a big house)' },
        { char: 'petit', romaji: 'puh-tee', meaning: 'small (masculine)', frequency: 55, example: 'un petit chat (a small cat)' },
        { char: 'petite', romaji: 'puh-teet', meaning: 'small (feminine)', frequency: 56, example: 'une petite fille (a little girl)' },
        { char: 'beau', romaji: 'boh', meaning: 'beautiful (masculine)', frequency: 57, example: 'un beau jour (a beautiful day)' },
        { char: 'belle', romaji: 'bell', meaning: 'beautiful (feminine)', frequency: 58, example: 'une belle femme (a beautiful woman)' },
        { char: 'nouveau', romaji: 'noo-voh', meaning: 'new (masculine)', frequency: 59, example: 'un nouveau livre (a new book)' },
        { char: 'nouvelle', romaji: 'noo-vell', meaning: 'new (feminine)', frequency: 60, example: 'une nouvelle voiture (a new car)' },

        // Greetings and common phrases
        { char: 'bonjour', romaji: 'bohn-zhoor', meaning: 'hello, good day', frequency: 61, example: 'Bonjour! Comment allez-vous?' },
        { char: 'bonsoir', romaji: 'bohn-swahr', meaning: 'good evening', frequency: 62, example: 'Bonsoir, madame' },
        { char: 'salut', romaji: 'sah-loo', meaning: 'hi, bye (informal)', frequency: 63, example: 'Salut! Ça va?' },
        { char: 'merci', romaji: 'mehr-see', meaning: 'thank you', frequency: 64, example: 'Merci beaucoup!' },
        { char: 'oui', romaji: 'wee', meaning: 'yes', frequency: 65, example: 'Oui, c\'est vrai' },
        { char: 'non', romaji: 'nohn', meaning: 'no', frequency: 66, example: 'Non, ce n\'est pas correct' },
        { char: 's\'il vous plaît', romaji: 'seel voo pleh', meaning: 'please (formal)', frequency: 67, example: 'S\'il vous plaît, aidez-moi' },
        { char: 's\'il te plaît', romaji: 'seel tuh pleh', meaning: 'please (informal)', frequency: 68, example: 'S\'il te plaît, viens ici' },
        { char: 'pardon', romaji: 'par-dohn', meaning: 'excuse me, sorry', frequency: 69, example: 'Pardon, je ne comprends pas' },
        { char: 'excusez-moi', romaji: 'eks-koo-zay mwah', meaning: 'excuse me (formal)', frequency: 70, example: 'Excusez-moi, monsieur' }
    ],

    sentences: [
        // Greetings and introductions - être sentences
        { char: 'Bonjour, comment allez-vous?', romaji: 'bohn-zhoor, koh-mahn tah-lay voo', meaning: 'Hello, how are you?', frequency: 1, example: 'Formal greeting' },
        { char: 'Je suis étudiant', romaji: 'zhuh swee ay-too-dyahn', meaning: 'I am a student', frequency: 2, example: 'Self-introduction with être' },
        { char: 'Tu es français?', romaji: 'too eh frahn-seh', meaning: 'Are you French?', frequency: 3, example: 'Question with être' },
        { char: 'Il est professeur', romaji: 'eel eh proh-feh-suhr', meaning: 'He is a teacher', frequency: 4, example: 'Statement with être' },
        { char: 'Elle est contente', romaji: 'ell eh kohn-tahnt', meaning: 'She is happy', frequency: 5, example: 'Adjective with être' },
        { char: 'Nous sommes amis', romaji: 'noo sohm ah-mee', meaning: 'We are friends', frequency: 6, example: 'Plural with être' },
        { char: 'Vous êtes gentil', romaji: 'voo zet zhahn-tee', meaning: 'You are kind', frequency: 7, example: 'Formal you with être' },
        { char: 'Ils sont ici', romaji: 'eel sohn tee-see', meaning: 'They are here', frequency: 8, example: 'Location with être' },

        // Having things - avoir sentences
        { char: 'J\'ai un chat', romaji: 'zhay uhn shah', meaning: 'I have a cat', frequency: 9, example: 'Possession with avoir' },
        { char: 'Tu as un livre', romaji: 'too ah uhn lee-vruh', meaning: 'You have a book', frequency: 10, example: 'Object with avoir' },
        { char: 'Elle a vingt ans', romaji: 'ell ah van tahn', meaning: 'She is twenty years old', frequency: 11, example: 'Age with avoir' },
        { char: 'Nous avons faim', romaji: 'noo zah-vohn fahm', meaning: 'We are hungry', frequency: 12, example: 'Expression with avoir' },
        { char: 'Vous avez raison', romaji: 'voo zah-vay reh-zohn', meaning: 'You are right', frequency: 13, example: 'Idiom with avoir' },
        { char: 'Ils ont soif', romaji: 'eel zohn swahf', meaning: 'They are thirsty', frequency: 14, example: 'Expression with avoir' },
        { char: 'J\'ai besoin d\'aide', romaji: 'zhay buh-zwahn ded', meaning: 'I need help', frequency: 15, example: 'Need with avoir' },

        // Going places - aller sentences
        { char: 'Je vais à l\'école', romaji: 'zhuh veh ah lay-kohl', meaning: 'I go to school', frequency: 16, example: 'Destination with aller' },
        { char: 'Tu vas au parc', romaji: 'too vah oh park', meaning: 'You go to the park', frequency: 17, example: 'Movement with aller' },
        { char: 'Il va bien', romaji: 'eel vah byahn', meaning: 'He is doing well', frequency: 18, example: 'Health with aller' },
        { char: 'Nous allons manger', romaji: 'noo zah-lohn mahn-zhay', meaning: 'We are going to eat', frequency: 19, example: 'Near future with aller' },
        { char: 'Vous allez à Paris?', romaji: 'voo zah-lay ah pah-ree', meaning: 'Are you going to Paris?', frequency: 20, example: 'Question with aller' },
        { char: 'Elles vont partir', romaji: 'ell vohn par-teer', meaning: 'They are going to leave', frequency: 21, example: 'Future action with aller' },

        // Doing things - faire sentences
        { char: 'Je fais mes devoirs', romaji: 'zhuh feh may duh-vwahr', meaning: 'I do my homework', frequency: 22, example: 'Task with faire' },
        { char: 'Tu fais du sport', romaji: 'too feh doo spohr', meaning: 'You do sports', frequency: 23, example: 'Activity with faire' },
        { char: 'Il fait beau', romaji: 'eel feh boh', meaning: 'The weather is nice', frequency: 24, example: 'Weather with faire' },
        { char: 'Nous faisons attention', romaji: 'noo fuh-zohn ah-tahn-syohn', meaning: 'We pay attention', frequency: 25, example: 'Expression with faire' },
        { char: 'Vous faites quoi?', romaji: 'voo fet kwah', meaning: 'What are you doing?', frequency: 26, example: 'Question with faire' },
        { char: 'Ils font la cuisine', romaji: 'eel fohn lah kwee-zeen', meaning: 'They are cooking', frequency: 27, example: 'Cooking with faire' },

        // Speaking - parler sentences
        { char: 'Je parle français', romaji: 'zhuh parl frahn-seh', meaning: 'I speak French', frequency: 28, example: 'Language with parler' },
        { char: 'Tu parles anglais?', romaji: 'too parl ahn-gleh', meaning: 'Do you speak English?', frequency: 29, example: 'Question with parler' },
        { char: 'Elle parle vite', romaji: 'ell parl veet', meaning: 'She speaks quickly', frequency: 30, example: 'Adverb with parler' },
        { char: 'Nous parlons ensemble', romaji: 'noo par-lohn ahn-sahmbl', meaning: 'We speak together', frequency: 31, example: 'Together with parler' },

        // Eating - manger sentences
        { char: 'Je mange du pain', romaji: 'zhuh mahnzh doo pan', meaning: 'I eat bread', frequency: 32, example: 'Food with manger' },
        { char: 'Tu manges une pomme', romaji: 'too mahnzh oon pohm', meaning: 'You eat an apple', frequency: 33, example: 'Fruit with manger' },
        { char: 'Il mange au restaurant', romaji: 'eel mahnzh oh res-toh-rahn', meaning: 'He eats at the restaurant', frequency: 34, example: 'Place with manger' },
        { char: 'Nous mangeons ensemble', romaji: 'noo mahn-zhohn ahn-sahmbl', meaning: 'We eat together', frequency: 35, example: 'Group with manger' },
        { char: 'Vous mangez bien', romaji: 'voo mahn-zhay byahn', meaning: 'You eat well', frequency: 36, example: 'Manner with manger' },

        // Drinking - boire sentences
        { char: 'Je bois de l\'eau', romaji: 'zhuh bwah duh loh', meaning: 'I drink water', frequency: 37, example: 'Liquid with boire' },
        { char: 'Tu bois du café', romaji: 'too bwah doo kah-fay', meaning: 'You drink coffee', frequency: 38, example: 'Beverage with boire' },
        { char: 'Elle boit du thé', romaji: 'ell bwah doo tay', meaning: 'She drinks tea', frequency: 39, example: 'Hot drink with boire' },
        { char: 'Nous buvons du vin', romaji: 'noo boo-vohn doo van', meaning: 'We drink wine', frequency: 40, example: 'Alcohol with boire' },

        // Wanting - vouloir sentences
        { char: 'Je veux un café', romaji: 'zhuh vuh uhn kah-fay', meaning: 'I want a coffee', frequency: 41, example: 'Desire with vouloir' },
        { char: 'Tu veux venir?', romaji: 'too vuh vuh-neer', meaning: 'Do you want to come?', frequency: 42, example: 'Invitation with vouloir' },
        { char: 'Il veut dormir', romaji: 'eel vuh dohr-meer', meaning: 'He wants to sleep', frequency: 43, example: 'Action with vouloir' },
        { char: 'Nous voulons apprendre', romaji: 'noo voo-lohn ah-prahn-druh', meaning: 'We want to learn', frequency: 44, example: 'Learning with vouloir' },

        // Being able to - pouvoir sentences
        { char: 'Je peux t\'aider', romaji: 'zhuh puh tay-day', meaning: 'I can help you', frequency: 45, example: 'Ability with pouvoir' },
        { char: 'Tu peux venir?', romaji: 'too puh vuh-neer', meaning: 'Can you come?', frequency: 46, example: 'Request with pouvoir' },
        { char: 'Elle peut chanter', romaji: 'ell puh shahn-tay', meaning: 'She can sing', frequency: 47, example: 'Skill with pouvoir' },
        { char: 'Nous pouvons danser', romaji: 'noo poo-vohn dahn-say', meaning: 'We can dance', frequency: 48, example: 'Permission with pouvoir' },

        // Questions and practical phrases
        { char: 'Comment vous appelez-vous?', romaji: 'koh-mahn voo zah-play voo', meaning: 'What is your name?', frequency: 49, example: 'Asking name formally' },
        { char: 'Je m\'appelle Marie', romaji: 'zhuh mah-pell mah-ree', meaning: 'My name is Marie', frequency: 50, example: 'Stating your name' },
        { char: 'Où sont les toilettes?', romaji: 'oo sohn lay twah-let', meaning: 'Where is the bathroom?', frequency: 51, example: 'Asking for location' },
        { char: 'Combien ça coûte?', romaji: 'kohm-byahn sah koot', meaning: 'How much does it cost?', frequency: 52, example: 'Shopping' },
        { char: 'Quelle heure est-il?', romaji: 'kell uhr eh-teel', meaning: 'What time is it?', frequency: 53, example: 'Asking for time' },
        { char: 'Il est deux heures', romaji: 'eel eh duh zuhr', meaning: 'It is two o\'clock', frequency: 54, example: 'Telling time' },
        { char: 'Je ne comprends pas', romaji: 'zhuh nuh kohm-prahn pah', meaning: 'I don\'t understand', frequency: 55, example: 'Expressing confusion' },
        { char: 'Parlez-vous anglais?', romaji: 'par-lay voo ahn-gleh', meaning: 'Do you speak English?', frequency: 56, example: 'Language question' },
        { char: 'Pouvez-vous m\'aider?', romaji: 'poo-vay voo may-day', meaning: 'Can you help me?', frequency: 57, example: 'Asking for help' },
        { char: 'Où est la gare?', romaji: 'oo eh lah gahr', meaning: 'Where is the train station?', frequency: 58, example: 'Asking for directions' },
        { char: 'C\'est combien?', romaji: 'seh kohm-byahn', meaning: 'How much is it?', frequency: 59, example: 'Price question' },
        { char: 'Je voudrais un café', romaji: 'zhuh voo-dreh uhn kah-fay', meaning: 'I would like a coffee', frequency: 60, example: 'Polite request' },
        { char: 'Où habites-tu?', romaji: 'oo ah-beet too', meaning: 'Where do you live?', frequency: 61, example: 'Asking about residence' },
        { char: 'J\'habite à Paris', romaji: 'zhah-beet ah pah-ree', meaning: 'I live in Paris', frequency: 62, example: 'Stating residence' },
        { char: 'Quel âge as-tu?', romaji: 'kell ahzh ah too', meaning: 'How old are you?', frequency: 63, example: 'Asking age' },
        { char: 'J\'ai vingt-cinq ans', romaji: 'zhay vant-sank ahn', meaning: 'I am 25 years old', frequency: 64, example: 'Stating age' },
        { char: 'Il fait froid aujourd\'hui', romaji: 'eel feh frwah oh-zhoor-dwee', meaning: 'It is cold today', frequency: 65, example: 'Weather comment' },
        { char: 'Le livre est sur la table', romaji: 'luh lee-vruh eh soor lah tahbl', meaning: 'The book is on the table', frequency: 66, example: 'Location description' },
        { char: 'La maison est grande', romaji: 'lah meh-zohn eh grahnd', meaning: 'The house is big', frequency: 67, example: 'Size description' },
        { char: 'Ce restaurant est bon', romaji: 'suh res-toh-rahn eh bohn', meaning: 'This restaurant is good', frequency: 68, example: 'Quality judgment' },
        { char: 'Cette voiture est rouge', romaji: 'set vwah-toor eh roozh', meaning: 'This car is red', frequency: 69, example: 'Color description' },
        { char: 'Mon frère est médecin', romaji: 'mohn frehr eh may-duh-san', meaning: 'My brother is a doctor', frequency: 70, example: 'Profession statement' }
    ]
};

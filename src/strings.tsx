import LocalizedStrings from 'react-native-localization';
const languages = {
  de: {
    base: 'https://load.dwgradio.net/de/',
    paypalUrl: 'https://www.paypal.com/donate/?hosted_button_id=CBDECENM9CM8Q',
    url: 'https://load.dwgradio.net/de/api/v1/',
    content: 'Inhalt',
    back: 'Zurück',
    theSearch: 'Suche',
    otherSermons: 'Weitere Vorträge von/über',
    collections: 'Sammlungen',
    speaker: 'Redner',
    category: 'Kategorie',
    bible: 'Biblisches Buch',
    biblePassage: 'Bibelstelle',
    chapter: 'Kapitel',
    reset: 'Zurücksetzen',
    apply: 'Ergebnisse anzeigen',
    cancel: 'Abbrechen',
    search: 'Suchen',
    select: 'Wählen',
    noConnection: 'Keine Internetverbindung',
    error: 'Es ist ein Fehler aufgetreten',
    enterSearchString: 'Geben Sie einen Suchbegriff ein',
    noEntriesFound: 'Keine Einträge gefunden',
    all: 'Alle',
    downloaded: 'Heruntergeladen',
    new: 'Neues',
    library: 'Bibliothek',
    downloads: 'Downloads',
    favorised: 'Gemerkt',
    history: 'Historie',
    holdAt: '',
    filter: 'Filter',
    collectionsDescription:
      'In den „Sammlungen“ sind Kategorie-übergreifend Vorträge zusammengestellt, die interessante, gemeinsame Merkmale vereint. Sammlungen können jederzeit neu dazukommen, gestrichen oder um weitere Titel erweitert werden. Von den "Kategorien" unterscheiden sich Sammlungen auch darin, dass sie nicht eine vollständige Liste aller Vorträge enthalten, sondern nur eine lose Auswahl. Mit den Kategorien verhält es sich so, dass jede Predigt mindestens einer Kategorie zugeordnet ist. Zu den Kategorien gelangt man über den Reiter „Alle“ und dann oben Links das Symbol „Filter“.',
    sortOptionName: 'Titel',
    sortOptionDuration: 'Dauer',
    sortOptionDate: 'Aufnahmedatum',
    sortOptionMostHeared: 'Meistgehörte',
    sortOptionNew: 'Neu bei DWG Load',
    sortOptionNameShort: 'Titel',
    sortOptionDurationShort: 'Dauer',
    sortOptionDateShort: 'Aufnahmedatum',
    sortOptionMostHearedShort: 'Meistgehörte',
    sortOptionNewShort: 'Neu',
    sortBy: 'Sortieren nach',
    today: 'Heute',
    yesterday: 'Gestern',
    info1:
      'DWG Load ist die Predigtdatenbank von DWG Radio. Gegenwärtig stehen über 15.000 Titel zum Hören, Speichern und Teilen bereit.',
    info2:
      'Ausnahmslos alle Prediger sind bibeltreue Nachfolger Jesu Christi. Regelmäßig kommen weitere Titel dazu.',
    info3:
      'Eingedenk dessen, dass alle menschliche Erkenntnis Stückwerk ist (1.Korinther 13,9), legen die Redner eigenverantwortliche ihre persönliche Sicht dar.',
    donation: 'Spenden',
    donationInfo1:
      'DWG Radio e.V. wird ausschließlich durch Spenden finanziert. Wir freuen uns, wenn du DWG Radio mit deiner Spende unterstützen möchtest.',
    donationInfo2:
      'DWG Radio ist als gemeinnützig anerkannt und stellt dir gerne eine Spendenbescheinigung für das Finanzamt aus.',
    bank: 'Bankverbindung',
    copyClipboard: 'In die Zwischenablage kopiert',
    dwgRadio:
      'DWG Radio e.V. | Schulstraße 19, 74251 Lehrensteinsfeld, Deutschland',
    iban: 'DE52620901000393781003',
    ibanFormatted: 'IBAN: DE52 6209 0100 0393 7810 03',
    bic: 'GENODES1VHN',
    bicFormatted: 'BIC: GENODES1VHN',
    or: 'Oder:',
    sleepTimer: 'Einschlaf-Timer',
    notFiltered: 'Alle',
    saved: 'Gemerkt!',
    removedSaved: 'Von der Merkliste entfernt!',
    minutes: 'Minuten',
    off: 'Aus',
    part: 'Teil',
    contact: 'Kontakt',
    contactUs: 'Schreib uns',
    dwgRadioInternet: 'DWG Radio im Internet',
    dwgLoadInternet: 'DWG Load im Internet',
    noDownloads: 'Keine Downloads',
    noFavorised: 'Keine gemerkten Titel',
    noHistory: 'Keine Titel in der Historie',
    deleteHistory: 'Historie löschen',
    deleteDownloads: 'Alle Downloads löschen',
    deleteFavorites: 'Alle Favoriten entfernen',
    historyDeleted: 'Historie gelöscht!',
    downloadDeleted: 'Download gelöscht!',
    downloadsDeleted: 'Downloads gelöscht!',
    favoritesDeleted: 'Favoriten entfernt!',
    delete: 'Löschen',
    deleteQuestion: 'Lokale Datei löschen?',
    info: 'Info',
    showResults: 'Ergebnisse Anzeigen',
    availableFilter: 'Verfügbare Filter',
  },
  cz: {
    base: 'https://load.dwgradio.net/cz/',
    paypalUrl: 'https://www.paypal.com/donate/?hosted_button_id=GJ2NUC5H46B7S',
    url: 'https://load.dwgradio.net/cz/api/v1/',
    content: 'Obsah',
    back: 'Zpět',
    theSearch: 'Hledat',
    otherSermons: 'Následující přednášky',
    collections: 'Sbírky přednášek',
    speaker: 'Přednášející',
    category: 'Kategorie',
    bible: 'Bible',
    biblePassage: 'Biblická pasáž',
    chapter: 'Kapitola',
    reset: 'Storno',
    apply: 'Potvrdit',
    cancel: 'Přerušit',
    search: 'Hledat',
    select: 'Vybrat',
    noConnection: 'Chybí internetové spojení',
    error: 'Došlo k chybě',
    enterSearchString: 'Zadejte hledaný výraz',
    noEntriesFound: 'Nenalezeny žádné výsledky (záznamy)',
    all: 'Vše',
    downloaded: 'Stáhnout',
    new: 'Nové',
    library: 'Knihovna',
    downloads: 'Stažené soubory',
    favorised: 'Oblíbené',
    history: 'Historie',
    holdAt: '',
    filter: 'Filtr',
    collectionsDescription:
      'Ve „Sbírkách přednášek“ jsou přednášky, které spojují zajímavé společné rysy, sestaveny napříč kategoriemi,. Sbírky přednášek lze kdykoliv přidávat, mazat nebo rozšiřovat o další tituly. Od „Kategorií“ se „Sbírky přednášek“ také liší v tom, že neobsahují úplný seznam všech přednášek, ale pouze jejich volný výběr. U „Kategorií“ platí, že je každá přednáška zařazena alespoň do jedné kategorie. Kategorie jsou přístupné přes kartu „Vše“ a potom přes ikonu „Filtr“ v levém horním rohu. ',
    sortOptionName: 'Titul',
    sortOptionDuration: 'Délka',
    sortOptionDate: 'Datum nahrávky',
    sortOptionMostHeared: 'Nejvíce přehrané',
    sortOptionNew: 'Nové na DWG Load',
    sortOptionNameShort: 'Titul',
    sortOptionDurationShort: 'Délka',
    sortOptionDateShort: 'Datum nahrávky',
    sortOptionMostHearedShort: 'Nejvíce přehrané',
    sortOptionNewShort: 'Nové',
    sortBy: 'Seřadit podle',
    today: 'Dnes',
    yesterday: 'Včera',
    info1:
      'DWG Load je databáze kázání DWG Radio. V současné době je k dispozici cca 1 000 titulů, které můžete poslouchat, ukládat a sdílet.',
    info2:
      'Všichni přednášející bez výjimky jsou biblicky věrní následovníci Ježíše Krista. V DWG Load pravidelně přibývají další tituly.',
    info3:
      'S vědomím, že veškeré lidské poznání je omezené (1. Kor. 13,9), prezentují přednášející své osobní názory na vlastní odpovědnost.',
    donation: 'Darovat',
    donationInfo1:
      'DWG Radio e.V. je financováno výhradně z darů. Budeme rádi, když se rozhodnete rádio DWG svým darem podpořit.',
    donationInfo2:
      'Rádio DWG je uznáno jako nezisková organizace (spolek). Rádi Vám vystavíme potvrzení o poskytnutém daru.',
    bank: 'Bankovní spojení',
    copyClipboard: 'Zkopírováno do schránky',
    dwgRadio:
      'DWG Radio e.V. | Schulstraße 19, 74251 Lehrensteinsfeld, Deutschland',
    iban: 'DE52620901000393781003',
    ibanFormatted: 'IBAN: DE52 6209 0100 0393 7810 03',
    bic: 'GENODES1VHN',
    bicFormatted: 'BIC: GENODES1VHN',
    or: 'Nebo:',
    sleepTimer: 'Časovač vypnutí',
    notFiltered: 'Nefiltrováno',
    saved: 'Označené',
    removedSaved: 'Odstraněno z Oblíbených',
    minutes: 'Minuty',
    off: 'Vypnout',
    part: 'Díl',
    contact: 'Kontakt',
    contactUs: 'Napište nám',
    dwgRadioInternet: 'DWG Radio na internetu',
    dwgLoadInternet: 'DWG Load na internetu',
    noDownloads: 'Žádné stažené soubory',
    noFavorised: 'Žádné oblíbené',
    noHistory: 'Žádné položky v historii',
    deleteHistory: 'Smazat historii',
    deleteDownloads: 'Smazat všechny stažené soubory',
    deleteFavorites: 'Smazat všechny oblíbené',
    historyDeleted: 'Historie smazána',
    downloadsDeleted: 'Stažené soubory smazány',
    favoritesDeleted: 'Oblíbené smazány',
    delete: 'Smazat',
    deleteQuestion: 'Smazat místní soubor?',
    info: 'Informace',
    showResults: 'Zobrazit výsledky',
    availableFilter: 'Dostupné filtry',
  },
  ru: {
    base: 'https://load.dwgradio.net/ru/',
    paypalUrl: 'https://www.paypal.com/paypalme/DWGru',
    url: 'https://load.dwgradio.net/ru/api/v1/',
    content: 'Содержание',
    back: 'Назад',
    theSearch: 'Поиск',
    otherSermons: 'Больше файлов',
    collections: 'Коллекции',
    speaker: 'Проповедник',
    category: 'Категория',
    bible: 'Библия',
    biblePassage: 'Место Писания',
    chapter: 'Глава',
    reset: 'Очистить',
    apply: 'Применить',
    cancel: 'Отменить',
    search: 'Искать',
    select: 'Фильтр',
    noConnection: 'Нет соединения с интернетом',
    error: 'Ошибка',
    enterSearchString: 'Введите текст',
    noEntriesFound: 'Файлов не найдено',
    all: 'Все',
    downloaded: 'Загружен',
    new: 'Новое',
    library: 'Библиотека',
    downloads: 'Загрузки',
    favorised: 'Избранное',
    history: 'История',
    holdAt: '',
    filter: 'Фильтр',
    collectionsDescription:
      'В «Колекции» проповеди собраны по рубрикам, в которых сочетаются интересные, общие черты. Коллекции могут быть добавлены в любое время, удалены или расширены, чтобы включить больше заголовков. Сборники также отличаются от «категорий» тем, что они содержат не полный список всех лекций, а только их выборку. Что касается категорий, то каждая проповедь относится как минимум к одной категории. Вы можете получить доступ к категориям через вкладку «Все», а затем значок «Фильтр» в левом верхнем углу.',
    sortOptionName: 'Название',
    sortOptionDuration: 'Длительность',
    sortOptionDate: 'Последние',
    sortOptionMostHeared: 'Популярность',
    sortOptionNew: 'Новое',
    sortOptionNameShort: 'Название',
    sortOptionDurationShort: 'Длительность',
    sortOptionDateShort: 'Последние',
    sortOptionMostHearedShort: 'Популярность',
    sortOptionNewShort: 'Новое',
    sortBy: 'Сортировать по',
    today: 'Сегодня',
    yesterday: 'Вчера',
    info1:
      'DWG Load — это база проповедей DWG Radio. В настоящее время доступно более 3500 проповедей, которые можно слушать, сохранять и делиться.',
    info2:
      'Все, без исключения, проповедники — верующие люди, последователи Иисуса Христа. Регулярно добавляются новые файлы.',
    info3:
      '“Ибо мы отчасти знаем и отчасти пророчествуем” (1 Кор. 13:9), каждый проповедник представляет свои личные взгляды.',
    donation: '',
    donationInfo1:
      'DWG Radio не преследует коммерческих интересов и финансируется за счет пожертвований. Размещенные на нем проповеди можно использовать только для личного пользования. Мы будем рады, если вы поддержите своими пожертвованием.',
    donationInfo2: '',
    bank: 'Банковские реквизиты',
    copyClipboard: 'Копируется в буфер обмена',
    dwgRadio: '',
    iban: '',
    ibanFormatted: 'Сбербанк 2202203669624878. Телефон +79203256990',
    bic: '',
    bicFormatted: 'Тинькофф 2200700737872035',
    or: 'Или',
    sleepTimer: 'Таймер сна',
    notFiltered: 'Без фильтра',
    saved: 'Сохранено!',
    removedSaved: 'Удалено из списка!',
    minutes: 'Минута',
    off: 'Выключено',
    part: 'Часть',
    contact: 'Контакт',
    contactUs: 'Напишите нам',
    dwgRadioInternet: 'Ссылка на DWG Radio',
    dwgLoadInternet: 'Ссылка на DWG Load',
    noDownloads: 'Нет загрузок',
    noFavorised: 'Нет избранный файлов',
    noHistory: 'Нет истории прослушивания',
    deleteHistory: 'Удалить историю',
    deleteDownloads: 'Удалить все загрузки',
    deleteFavorites: 'Удалить все избранные',
    historyDeleted: 'История удалена!',
    downloadsDeleted: 'Загрузки удалены!',
    favoritesDeleted: 'Избранные удалены!',
    delete: 'Удалить',
    deleteQuestion: 'Удалить локальный файл?',
    info: 'Информация',
    showResults: 'Показать результаты',
    availableFilter: 'Доступные фильтры',
  },
};

export const strings = new LocalizedStrings({
  currentLanguage: languages.de,
});

import {
  proposalRoleDefinitions,
  proposalRoleIdAliases,
} from "@/content/proposal-roles"

export const siteConfig = {
  couple: {
    bride: "Ruby Mae G. Vergara", //Noenyl Bryle M. Gonzaga
    brideNickname: "Ruby", //Khey
    groom: "Khey Greggy P. Moyani",
    groomNickname: "Khey",
    monogram:"/monogram/new-monogram.png" ,//Ltryl
    backgroundMusic:"/background_music/Haley Reinhart - Can't Help Falling In Love (Official Audio).mp3"
  },
  googleAPI:{
    messageForm: "https://docs.google.com/forms/d/e/1FAIpQLScg_biDuM8tjkVvDhZwxgbIjLTmdRkxtMY9kmtWNNDUdvvBIQ/formResponse",   //done
    message: "https://script.google.com/macros/s/AKfycbxToP-CCmR1uNl_EQkcIDCVzApqkV9--jCjbl5534qUPUecEuR6nRfyVwX9FfeW-6PJ/exec",  //done
    guestList: "https://script.google.com/macros/s/AKfycbxwUGCC0WgQio9cXwpAZM24RpYc9uFOQWYkfjYe9SwfzMulCNR5Lemn2570L5J5eh5O/exec",  //done
    guestRequest: "https://script.google.com/macros/s/AKfycbxwi_bWSawEm6Dxa_kRDG_QNr8NSM1sPiNXhfUDZOKY9CnZbGc2b0txp8PGZRV26YJn/exec",  //done
    entourage: "https://script.google.com/macros/s/AKfycbxbi9O4R3Zt1lsxw6pYvfhXgHw7bTwkwXehnBrVN32x5EyN1NiovCf59LO5Ar8ephBv/exec",  //done
    sponsors: "https://script.google.com/macros/s/AKfycbxq7GenEBE2eWOySPlGA8uFk_qJzX9hjMZqaavRDZuSgPsTcFKwd5Y3cj-1k_s_qcJO/exec",  //done
    weddingDetails: "https://script.google.com/macros/s/AKfycbxWoI4pTXoSeqOlyLF7mhXOUhxYZjHLlTZilUPOc-rLWJe1jDqt4z1zgqtH2f1CCtM/exec",   //done
    proposalResponses: "https://script.google.com/macros/s/AKfycbwSlPEGkg_9K_OY0lqPnlkLg7hnSdQP0ZASR06dJQW5tT5ADsobyVfIevQAfDoggVxO1Q/exec",  //done
////google share 
    googleShare: "https://docs.google.com/spreadsheets/d/1Dw0Sd88bnVLtxFHh-EEP8ViAK6duGqAemdXXYCsjFgM/edit?usp=sharing", //done
  },
  wedding: {
    date: "September 14, 2026",
    time: "2:00 PM",
    venue: "Lupit Church",
    tagline: "are getting married!",
    theme: "Our wedding palette is inspired by timeless elegance and warmth.Motif Colors: Champagne Gold, Soft Beige, Warm Soft Brown",
    motif: "#BBCED5, #B9C3A8, #F3D8C5, #D1C4D4, #ECD8BA, #F4E8D8, #E1DCCF",
  },
  proposal: {
    // Use "Maid of Honor" for unmarried, "Matron of Honor" for married
    honorAttendant: "Maid of Honor" as "Matron of Honor" | "Maid of Honor",
    roles: proposalRoleDefinitions,
    roleIdAliases: proposalRoleIdAliases,
  },
  details: {
    rsvp: {
      deadline: "September 10, 2026",
      contact: "Ruby Mae G. Vergara",
      phone: "to be announced",
    },
  },
  contact: {
    bridePhone: "to be announced",
    groomPhone: "to be announced",
    email: "to be announced",
  },
  giftRegistry: {
    QR_1:{
    id: "Gcash",
    src: "/QR/Gcash.png",
    label: "Gcash",
    accountNumber: "RU*Y M** V. : 0998 860 ****",
    }
    // ,
    // QR_2:{
    // id: "Zelle",
    // src: "/monogram/Zelle.png",
    // label: "Zelle",
    // accountNumber: "Patrick: xxx-xxx-0009",
    // }
  },
  ceremony: {
    location: "Lupit Church",
    venue: "Lizares Ave, Bacolod City, Negros Occidental 6100 Philippines",
    map: "https://share.google/tSCddmm4PVDBL0Pzx",
    date: "September 14, 2026",
    day: "Monday",
    time: "2:00 PM",
    entourageTime: "1:00 PM",
    guestsTime: "1:30 PM",
    image: "/Details/ceremony.png",
  },
  reception: {
    location: "Sugarland Hotel",
    venue: "Araneta Street, Araneta Ave, Bacolod, 6100 Negros Occidental",
    map: "https://share.google/DbU3HDxkZwDjASOml",
    date: "September 14, 2026",
    day: "Monday",
    time: "6:00 PM",
    image: ["/Details/reception.png","/Details/reception1.png"],
  },
  dressCode: {
      theme: "SEMI-FORMAL",
    colors: "#BBCED5, #B9C3A8, #F3D8C5, #D1C4D4, #ECD8BA, #F4E8D8, #E1DCCF",
    sponsors: {
      male: "Guests are kindly requested to wear attire in any of the shades within our wedding palette.Color pallet and image to be followed. STRICTLY no shorts, maong jeans, t-shirts, or slippers.",
      female: "Guests are kindly requested to wear attire in any of the shades within our wedding palette.Color pallet and image to be followed. STRICTLY no shorts, maong jeans, t-shirts, or slippers.",
      notes: "Your Presence will make our day even more special \n Ninong: Formal Wear : Charcoal Gray suid and Slacks, white long sleeves, and burgundy neckite \n Ninang: Long Dress / Formal Dress Burgundy Long Formal Dress.",
      photo: "/Details/sponsors.png",
      palette: "#A77258, #D3A388, #E4B293,#E6BBA5,#0B120F, #FFFFFF"
    },
    entourage: {
      gents: "Guests are kindly requested to wear attire in any of the shades within our wedding palette.Color pallet and image to be followed. STRICTLY no shorts, maong jeans, t-shirts, or slippers.",
      ladies: "Guests are kindly requested to wear attire in any of the shades within our wedding palette.Color pallet and image to be followed. STRICTLY no shorts, maong jeans, t-shirts, or slippers.",
      notes: "Your Presence will make our day even more special \n Ninong: Formal Wear : Charcoal Gray suid and Slacks, white long sleeves, and burgundy neckite \n Ninang: Long Dress / Formal Dress Burgundy Long Formal Dress.",
      photo: "/Details/sponsors.png",
      palette: "#A77258, #D3A388, #E4B293,#E6BBA5,#0B120F, #FFFFFF",
    },
    guests: {
      gents: "Guests are kindly requested to wear attire in any of the shades within our wedding palette.Color pallet and image to be followed. STRICTLY no shorts, maong jeans, t-shirts, or slippers.",
      ladies: "Guests are kindly requested to wear attire in any of the shades within our wedding palette.Color pallet and image to be followed. STRICTLY no shorts, maong jeans, t-shirts, or slippers.",
      notes: "WE KINDLY ASK OUR GUEST TO WEAR THESE COLORS \n Gentlemen : Long sleeves / suit and slacks \n Ladies : Long Dress / Formal Dress",
      photo: "/Details/guest.png",
      palette: "#A02C1D, #5F6E2D, #F38013,#86299C,#5A78AE, #EB3764",
    },
    note: "We kindly request our guests to dress in attire following our wedding palette."
  },
  narratives: {
    ourStory: `Once upon a signature…

Our story began with a simple signature, one that slowly turned into something magical. He was my financial advisor, and I was there to sign documents. It was July 5, 2021, and we met at the Lobby of the building. Little did we know, that ordinary day would start a story neither of us expected.

I wasn't looking for anything, yet somehow, our connection grew in its own gentle, unexpected way. And then, on June 1, 2022, our story truly began—we became us. We found a love that feels like home.

Our journey wasn't rushed, but perfectly timed. We believe that God brought us together in His own way and season.

With hearts full of gratitude, we step into this new chapter hand in hand, trusting His plan and celebrating a love rooted in faith, patience, and grace.

Today, we choose each other- again and again- and we can't wait to celebrate this new chapter with the people we love most.`,
    groom: `The first time Mark saw Catherine, time seemed to slow down. It was an ordinary day that instantly became unforgettable: one smile, one hello, and suddenly his world had a new center. He didn't have the perfect words ready, but he knew he had met someone who felt like home.

Early conversations turned into late-night talks, sharing dreams, favorite meals, and whispered prayers for a future together. With every small adventure—coffee runs, long drives, quiet walks—Mark found himself choosing her over and over again. He loved how she laughed freely, how she listened with her whole heart, and how her faith steadied him.

There were seasons of distance and long workdays, but every reunion reminded him why he stayed patient: because Catherine was worth every mile and every minute apart. When he finally knelt to ask for her hand, it wasn't a question of "if," only "when can we start forever?"`,
    bride: `Catherine remembers the first time Mark said her name. It was gentle but sure, a kindness that made her feel both seen and safe. In that softness, she found a partner who met her with the same grace she prayed to give.

Mark's steadiness won her heart: the way he showed up, even when schedules were tight, and how he always found lightness in the small things. He celebrated her wins, held space for her worries, and never hesitated to choose "us" in every decision.

Now, as they prepare to say yes before God and the people they love most, Catherine is grateful for the patience, humor, and hope Mark brings to every day. She knows this next chapter is just the start of the love story they get to write together.`,
  },
  colors: {
    primary: "#87AE73",
    secondary: "#F5F5DC",
  },
  playlist: {
    title: "A Playlist from our hearts",
    subtitle: "Songs that have been part of our journey together",
    playlistName: "Mae & Gregg Wedding",
    embedUrl:
      "https://open.spotify.com/embed/playlist/2FUZHCJs6Z5iBvP0rKvQdu?utm_source=generator",
    spotifyUrl: "https://open.spotify.com/playlist/2FUZHCJs6Z5iBvP0rKvQdu",
  },
  snapShare: {
    googleDriveLink:
      "https://drive.google.com/drive/folders/1guL3003TCXnxN5MaZzuGkA1yi3Ia8SIS?usp=sharing",
    albumQR: "/QR/AlbumQR.png",
    hashtag: [],
    instructions: "Please scan this QR Code and upload the photos and videos you have taken during our wedding reception. We are delighted to see your snaps too!",
  },
}

export const entourage = [
  { role: "Best Man", name: "Engr. Kevin Christian Mariñas" },

  // Bridesmaids
  { role: "Bridesmaid", name: "Thea Lynn Dela Cruz" },
  { role: "Bridesmaid", name: "Keara Zane A Cariño" },
  { role: "Bridesmaid", name: "Fidnah Gracia Padallan" },
  { role: "Bridesmaid", name: "Lorna Ladisla" },
  { role: "Bridesmaid", name: "Carla Vanessa Tabilin" },
  { role: "Bridesmaid", name: "Romela Tolentino" },
  { role: "Bridesmaid", name: "Emmalyn Lipio" },
  { role: "Bridesmaid", name: "Carmen Pascual" },
  { role: "Bridesmaid", name: "Ciddie Manota" },

  // Groomsmen
  { role: "Groomsman", name: "Noah Alcaria" },
  { role: "Groomsman", name: "Jervin Garcia" },
  { role: "Groomsman", name: "Myric Mateo" },
  { role: "Groomsman", name: "Caughvan Faustino" },
  { role: "Groomsman", name: "Jayson Torquiano" },
  { role: "Groomsman", name: "Jendah Egino" },
  { role: "Groomsman", name: "Vincent Saguinsin" },
  { role: "Groomsman", name: "Frederick Manota" },
  { role: "Groomsman", name: "Emerson Sulit" },

  // Secondary Sponsors
  { role: "Veil Sponsor", name: "Micaela", group: "veil" },
  { role: "Veil Sponsor", name: "Ian", group: "veil" },
  { role: "Cord Sponsor", name: "Marion", group: "cord" },
  { role: "Cord Sponsor", name: "Christian", group: "cord" },

  // Flower Girls and Little Bride
  { role: "Flower Girl", name: "Kirsten Elija Leyson" },
  { role: "Flower Girl", name: "Blake Juan" },
  { role: "Flower Girl", name: "Reign Arastel Rivera" },
  { role: "Little Bride", name: "Paige Yael Ticbaen" },
]

export const principalSponsors = [
  { name: "", spouse: "Engr. Rosemarie Bagadiong" },
  // Paired from provided Male and Female Sponsors (order-based)
  // { name: "Mr. Jony Balao", spouse: "Mrs. Conception Balao" },
  // { name: "Mr. Cresencio Francisco", spouse: "Dr. Editha Francisco" },
  // { name: "Mr. Aurelio Sab-it", spouse: "Mrs. Ester Sab-it" },
  // { name: "Mr. Pio McLiing", spouse: "Mrs. Edna Boloma" },
  // { name: "Mr. Fabian Dupiano", spouse: "Mrs. Mary Christine Dupiano" },
  // { name: "Mr. Roberto Dosdos", spouse: "Mrs. Angelica Dosdos" },
  // { name: "Mr. George Sacla", spouse: "Mrs. Minda De Bolt Sacla" },
  // { name: "Mr. Elmo Casallo", spouse: "Mrs. Nora Casallo" },
  // { name: "Engr. Jimmy Atayoc Sr", spouse: "Mrs. Mercedes Atayoc" },
  // { name: "Mr. Tomas Moyongan", spouse: "Mrs. Betty Moyongan" },
  // { name: "Mr. Roger Balantin", spouse: "Mrs. Delia Balantin" },
  // { name: "Honorable Mayor Roderick Awingan", spouse: "Mrs. ____ Awingan" },
  // { name: "Engr Roy Kepes", spouse: "Vice Gove MaryRose Kepes Fongwan" },
  // { name: "Mr. Bobos Nestor Fongwan", spouse: "Mrs. Marga Sison" },
  // { name: "Mr. Junvic Suguinsin", spouse: "Mrs. Lavenia Inson" },
  // { name: "Mr. Salino Dosdos Jr", spouse: "Mrs. Gina Guiang" },
  // { name: "Mr. Pampilo Balajadia", spouse: "Mrs. Angelica Balajadia" },
  // { name: "Mr. Alan M. Serduar", spouse: "Mrs. Oliva Serduar" },
  // { name: "Mr. Miguel Franco", spouse: "Mrs. Angela Balajadia" },
  // Remaining Female Sponsors without paired male
  // { name: "Mrs. Carina C. Watanabe", spouse: "" },
  // { name: "Mrs. Cecile Palilio", spouse: "" },
  // { name: "Mrs. Nida Saguinsin", spouse: "" },
  // { name: "Mrs. Araceli Pitogo", spouse: "" },
  // { name: "Mrs. Alda Unidad", spouse: "" },
  // { name: "Mrs. Reine Bernadeth Bolanos", spouse: "" },
]

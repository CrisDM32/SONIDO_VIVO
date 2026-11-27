// El nombre permite recuperar también las fotos de los carritos anteriores al uso del código.
const fotos = [
  ["GA001", "Guitarra Acústica Folk", "https://instrumentosallegro.com.ve/publish/IMG_Products/F310.jpg"],
  ["GA002", "Guitarra Acústica Dreadnought", "https://www.ma2da-online.net/data/matsuda/product/20250927_c1c3de.jpg"],
  ["GA003", "Guitarra Acústica Clásica 4/4", "https://amadeus123.com/cdn/shop/files/C401043x1043.jpg?v=1772228374"],
  ["GA004", "Guitarra Electroacústica", "https://resources.claroshop.com/medios-plazavip/mkt/64af4747c4b44_gn20ce-nsjpg.jpg?qlty=75&scale=500"],
  ["GA005", "Guitarra 3/4 Niños", "https://i5.walmartimages.com/asr/7b0d9faf-28fe-4495-9eda-7ae8db5e629b.b5e46433cb705e2b602ed32dd7eadbc0.jpeg"],
  ["GE001", "Guitarra Eléctrica Stratocaster", "https://img-zuhalmuzik.mncdn.com/mnresize/1000/1000/images/product/1552430372873106%202.jpg"],
  ["GE002", "Guitarra Eléctrica Les Paul", "https://www.chicagomusicexchange.com/cdn/shop/products/epiphone-electric-guitars-solid-body-epiphone-les-paul-standard-50s-metallic-gold-eils5mgnh1-28311746314375_720x720%403x.jpg?v=1652014916"],
  ["GE003", "Guitarra Eléctrica SG", "https://www.chicagomusicexchange.com/cdn/shop/products/epiphone-electric-guitars-solid-body-epiphone-sg-standard-ebony-eissbebnh1-28706091139207.jpg?v=1652570231"],
  ["GE004", "Guitarra Eléctrica Telecaster", "https://cdn.awsli.com.br/2500x2500/2609/2609787/produto/2195045945faacc8ee5.jpg"],
  ["GE005", "Guitarra Eléctrica Semi-hollow", "https://www.mikigakki.com/img/goods/2/AME4580568418098.jpg"],
  ["BA001", "Bajo Eléctrico 4 Cuerdas", "https://cdn.shoplightspeed.com/shops/608329/files/54163691/squier-squier-affinity-pj-bass-laurel-fretboard-la.jpg"],
  ["BA002", "Bajo Eléctrico Jazz Bass", "https://musicmarket.com.pe/cdn/shop/products/53091045.png?v=1615481050&width=1024"],
  ["BA003", "Bajo Acústico 4 Cuerdas", "https://auctions.c.yimg.jp/images.auctions.yahoo.co.jp/image/dr000/auc0408/users/9b40ac01ddc680e3915f5fd40aa6b79d117aa8b9/i-img1200x1200-1693059090u8zlfq109143.jpg", "Yamaha APX-B12F Fretless Acoustic Bass"],
  ["BT001", "Batería Acústica 5 piezas", "https://casamusicalstrauss.com.pe/cdn/shop/products/bateria-pearl-roadshow-jet-black-rs525scc-31-D_NQ_NP_691555-MPE31254699226_062019-F.jpg?v=1674589027"],
  ["BT002", "Batería Electrónica 8 pads", "https://musicplus.tn/24466-large_default/roland-td-02kv-batterie-electronique-v-drums.jpg"],
  ["BT003", "Caja Snare 14\"", "https://item-shopping.c.yimg.jp/i/n/g-sakai_us1450-pearl", "Pearl US1450 Universal Steel Snare Drum"],
  ["BT004", "Platillo Hi-Hat 14\"", "https://tiendafeedback.com.ar/13346-large_default/platillo-zildjian-hi-hat-avedis-new-beat-14.jpg"],
  ["BT005", "Platillo Crash 16\"", "https://cdnbatera.bateraclube.com.br/files/122/PROD_140417111538.jpg"],
  ["TC001", "Teclado Digital 61 teclas", "https://electromegaecuador.com/3122-large_default/teclado-yamaha-portatil-de-61-teclas-con-pantalla-lcd-622-sonidos-psr-e373.jpg"],
  ["TC002", "Piano Digital 88 teclas", "https://cdn.awsli.com.br/2500x2500/2462/2462538/produto/168923817/cdd32e035f.jpg"],
  ["TC003", "Sintetizador 49 teclas", "https://cdn.long-mcquade.com/files/89262/lg_e87123d2303fb8dd104e32bab408f7c5.png", "Arturia KeyLab Essential 49 Universal MIDI Controller"],
  ["TC004", "Teclado MIDI 88 teclas", "https://moogaudio.com/cdn/shop/products/maudiohammer88.jpg?v=1622826385"],
  ["AM001", "Amplificador Guitarra 15W", "https://cdn11.bigcommerce.com/s-c3f06q9uvc/images/stencil/1280x1280/products/562216/2316254/e79584c9-0b64-421f-a1d9-e5dbd8a135c3__90886.1777740978.jpg?c=1"],
  ["AM002", "Amplificador Guitarra 40W", "https://m.media-amazon.com/images/I/71DxnEJl3EL.jpg", "Marshall DSL40CR 40W Combo Guitar Amplifier"],
  ["AM003", "Amplificador Bajo 100W", "https://www.musicstorelive.com/media/catalog/product/h/a/hartke-a100_4.jpg?bg-color=255%2C255%2C255&canvas=700%3A700&fit=bounds&height=700&optimize=low&width=700", "Hartke A100 100-Watt Bass Combo Amplifier"],
  ["AM004", "Amplificador Acústico 40W", "https://carltonmusic.com/cdn/shop/files/Fishman_Loudbox_Mini_Bluetooth_Acoustic_Guitar_Amplifier-68800ca5dad4a_a4f0e161-4baf-4297-a02a-5515de63d9be.jpg?v=1753222409&width=1946"],
  ["MI001", "Micrófono Dinámico Cardioide", "https://storage.googleapis.com/stateless-blog-g4m-co-uk/2024/09/Shure-SM58-Dynamic-Cardioid-Vocal-Microphone.jpg"],
  ["MI002", "Micrófono Dinámico Instrumento", "https://cdn11.bigcommerce.com/s-4hc0jwsnnq/images/stencil/original/products/19027/63768/328846-SHURE%20SM57%20HERO__95274.1715151356.jpg?c=1"],
  ["MI003", "Micrófono Condensador", "https://www.musamaailma.fi/media/catalog/product/cache/f8158826193ba5faa8b862a9bd1eb9e9/a/u/audiotechnica_at2020_3_1000px.jpg"],
  ["MI004", "Micrófono USB de Condensador", "https://www.bluemics.ru/wa-data/public/shop/products/57/02/257/images/1104/1104.970x0.png"],
  ["PE001", "Pedal Distorsión", "https://cdn11.bigcommerce.com/s-k2zti3v21f/images/stencil/original/products/8168/11303/ds1_gal__12667.1649867041.jpg?c=1"],
  ["PE002", "Pedal Reverb", "https://vietmusic.vn/cdn/shop/files/pedal-guitar-boss-rv-6-reverb-viet-music.jpg?v=1715425375&width=1946"],
  ["PE003", "Pedal Multi-efectos", "https://www.musicalesdoris.com/cdn/shop/products/c1582bcabdf9_1280x.jpg?v=1598655451"],
  ["PE004", "Pedal Tuner Cromático", "https://cdn.awsli.com.br/1206/1206814/produto/53656380/8add2f322a.jpg"],
  ["PE005", "Pedal Delay", "https://guitarcentre.net.au/cdn/shop/products/11169000001.MAIN__89194.1576897864.jpg?v=1629182455"],
  ["PE006", "Pedal Overdrive", "https://foundsound.com.au/cdn/shop/products/Ibanez_TS9_ca19afa8-a815-46f9-9574-5a40f7c0fd1c.jpg?v=1657426296"],
  ["AC001", "Cuerdas Guitarra Eléctrica 09-42", "https://izzomusical.vtexassets.com/arquivos/ids/158122-768-auto/ERNIE-BALL_12858_ENC.-009-042-P-GUITARRA-SUPER-SLINK-NIQUEL-P02223_01.webp?quality=8&v=637602295553200000"],
  ["AC002", "Cuerdas Guitarra Acústica 12-53", "https://shop.scavino.it/files/scavino2_Files/Foto/782319_2.PNG", "Ernie Ball Earthwood Medium Light Acoustic Guitar Strings"],
  ["AC003", "Cuerdas Bajo 45-105", "https://www.bassline.it/7377-thickbox_default/ernie-ball-2856-regular-slinky-bass-45-105-medium-scale.jpg"],
  ["AC004", "Púas de Guitarra x10 (0.73mm)", "https://cdn.shopify.com/s/files/1/0343/4368/2183/products/fender-accessories-picks-fender-351-pick-pack-12-shell-medium-1980351800-28332787728519_720x720%402x.jpg?v=1652476624", "Fender 351 Medium Shell Celluloid Picks"],
  ["AC005", "Capotraste Guitarra", "https://static.wixstatic.com/media/61c394_82a188e296f946048779fa2619e32936~mv2.jpg/v1/fit/w_500%2Ch_500%2Cq_90/file.jpg"],
  ["AC006", "Afinador de Clip", "https://ritzcamera.com/cdn/shop/products/1_0f9cb75f-0ed3-467f-b9d1-633f902e97b4.jpg?v=1598371642"],
  ["AC007", "Cable Instrumento 3m", "https://media.sweetwater.com/api/i/q-82__w-750__ha-16a9f2637d2adc3b__hmac-243ad6781d6dad1bddd69db1c91b4310043df0a9/images/items/750/S100I12-large.jpg", "Monster Standard 100 Instrument Cable"],
  ["AC008", "Cable Instrumento 6m", "https://media.sweetwater.com/api/i/q-82__w-1080__h-1080__fit-bounds__canvas-1080%2C1080__ha-e99b1b95269a04ca__hmac-faeee10f75896fff6101c04167fbf97e474ebf2f/images/items/750/S100I21-large.jpg", "Monster Standard 100 Instrument Cable"],
  ["AC009", "Soporte Guitarra de Piso", "https://musicmajlis.co/cdn/shop/products/hercules-gs302b-guitar-stand-elec-floor-foldable-musicmajlis-1.webp?v=1738774865&width=1500"],
  ["AC010", "Soporte Guitarra de Pared", "https://cdn.shopify.com/s/files/1/0432/1801/0270/products/Hercules-GSP39SB-PLUS-Colgador-de-guitarra.jpg?v=1634755863", "Hercules GSP39SB PLUS Guitar Wall Hanger"],
  ["ES001", "Interfaz de Audio 2x2 USB", "https://www.visionguitar.com/cdn/shop/products/solo-3_600x600.jpg?v=1571709235"],
  ["ES002", "Auriculares de Estudio", "https://cdn.awsli.com.br/2500x2500/1757/1757278/produto/256078453/155-ko7t2afcjj.png"],
  ["ES003", "Auriculares de Estudio Pro", "https://cdn.awsli.com.br/2500x2500/125/125927/produto/379551095/297aebe45a7733f564f40834e216c394-029riuv6uu.jpg"],
  ["ES004", "Monitor de Estudio 5\"", "https://www.sweelee.com.my/cdn/shop/products/products_2FY01-HS5B_2FY01-HS5B_1669008424990.jpg?v=1669008434&width=2048"],
  ["ES005", "Pop Filter para Micrófono", "https://www.gigstore.ae/media/catalog/product/cache/2c2bb28587e86319a0f3fdc65dd83b65/m/z/mzp_40.jpg"],
]

const porCodigo = new Map()
const porNombre = new Map()
for (const [codigo, nombre, url, referencia] of fotos) {
  const foto = { url, referencia }
  porCodigo.set(codigo, foto)
  porNombre.set(nombre, foto)
}

function buscarFoto({ codigo, nombre }) {
  return codigo ? porCodigo.get(codigo) : porNombre.get(nombre)
}

export function fotoDeProducto(producto) {
  return buscarFoto(producto)?.url
}

export function referenciaDeFoto(producto) {
  return buscarFoto(producto)?.referencia
}

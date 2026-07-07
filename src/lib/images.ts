/**
 * ═════════════════════════════════════════════════════════════════════════
 *   FOTOS DE LAS BEBIDAS  ->  CARGALAS ACA, UNA POR UNA
 * ═════════════════════════════════════════════════════════════════════════
 *
 *  COMO CARGAR UNA FOTO
 *  --------------------
 *  1) Conseguí el link de una imagen. Tiene que ser un link DIRECTO a la
 *     imagen: debe terminar en .jpg, .jpeg, .png o .webp.
 *        SIRVE:    https://sitio.com/fotos/fernet.jpg
 *        NO SIRVE: https://www.google.com/search?...   (eso es una busqueda)
 *        NO SIRVE: https://sitio.com/pagina-del-fernet (eso es una pagina)
 *
 *     Truco para sacar el link directo: en la compu, click derecho sobre la
 *     imagen -> "Copiar direccion de la imagen" (o "Copy image address").
 *
 *  2) Pegá ese link entre las comillas al lado de la bebida que corresponde,
 *     en el objeto DRINK_IMAGES (o INGREDIENT_IMAGES para el armador de tragos).
 *
 *  3) Guardá el archivo. La foto aparece sola.
 *
 *  Si dejás una vacía (""), se muestra el dibujo de la bebida. Nunca queda rota.
 *
 *  Tip: podés usar tus propias fotos poniendolas en la carpeta /public del
 *  proyecto y referenciandolas como "/mis-fotos/fernet.jpg".
 */

// clave (id de la bebida)  ->  link de la foto
export const DRINK_IMAGES: Record<string, string> = {
  vino: "https://ardiaprod.vtexassets.com/arquivos/ids/323200-500-auto?v=638599553063470000&width=500&height=auto&aspect=true", // Vino
  cerveza: "https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/3100531_f.jpg", // Cerveza
  sidra: "https://acdn-us.mitiendanube.com/stores/001/211/660/products/18881-1a4dff415d1c6919df16195554585991-640-0.webp", // Sidra
  sake: "https://distriporvenir.com/wp-content/uploads/2025/04/Sho-Chiku-Bai-Mini-180-ml-%E2%80%93-Sake-japones-premium-en-tamano-ideal.jpg", // Sake
  hidromiel: "https://http2.mlstatic.com/S_Q_NP_2X_639194-MLA99373081936_112025-V.webp", // Hidromiel
  gancia: "https://lirp.cdn-website.com/3a028577/dms3rep/multi/opt/WhatsApp+Image+2024-11-08+at+11.15.53-640w.jpeg", // Gancia
  ginebra: "https://static.wixstatic.com/media/5dcf57_d8fbc7569d6d4b658db09864d66812d5~mv2.jpeg/v1/fill/w_560,h_644,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/5dcf57_d8fbc7569d6d4b658db09864d66812d5~mv2.jpeg", // Ginebra
  ron: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROGzMTX2ULH2E9KuEGFs1GeDMufIBA6kKz-8fWQlM_x7rAoE4YFAkoiMlf&s=10", // Ron
  brandy: "https://acdn-us.mitiendanube.com/stores/002/483/999/products/soberano-brandy-solera-700ml1-01f6c3511397125ce116839977256475-640-0.webp", // Brandy
  tequila: "https://guateselectos.com/cdn/shop/files/PhotoRoom_20210610_090147.jpg?v=1748297686&width=1920", // Tequila
  whisky: "https://jumboargentina.vtexassets.com/arquivos/ids/791034/Whisky-Johnnie-Walker-Blue-Label-Tif-750-Whisky-Johnnie-Walker-Blue-Label-Botella-750ml-3-247761.jpg?v=638283369763370000", // Whisky
  vodka: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKV4Zvqi3Ve_3HFw9Ge4JqS2oRTklTxexyW1J8EALpO8KyVkzvDu0x6Vk&s=10", // Vodka
  "fernet-solo": "https://acdn-us.mitiendanube.com/stores/006/757/969/products/38-c1631ba24e622cb6b217750533905044-1024-1024.webp", // Fernet (solo)
  cynar: "https://casadevinosmendoza.com.ar/wp-content/uploads/2024/09/Aperitivo-Cynar-Original-750ml-x-1-unidad.jpg", // Cynar
  "fernet-cola": "https://acdn-us.mitiendanube.com/stores/004/462/347/products/promo-coca-y-fernet1-6e64c7c74c2eec23ea16208375658818-480-0-cb8f581a5d5de15c4917165903950298-640-0.webp", // Fernet con Coca
  "gin-tonic": "https://ardiaprod.vtexassets.com/arquivos/ids/342084/Gin---Tonic-Limon-Shooter-355-Ml-_1.jpg?v=638708913726900000", // Gin Tonic
  "whisky-cola": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKlj6fqYc_mQuWSpE6JLmsD1DBufd2ugzoyqpmhMrGWRvaoK8fvFGY90U&s=10", // Whisky con Coca
  "cuba-libre": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcki8r-mMq3V3hoDYXwXXIXRGyxaE-ZB6VOeH4myv3H_dFfdYC09wR6gw&s=10", // Cuba Libre (ron con cola)
  "vodka-jugo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0BVkz9Asor8Hq-IJIxdWRE0RBEDAMPX8BBb-VJVH8DF3uSudoHJsROnT2&s=10", // Vodka con jugo
  "vodka-energizante": "https://http2.mlstatic.com/D_NQ_NP_837372-MLA107960333411_032026-O.webp", // Vodka con energizante
  "aperol-spritz": "https://casadevinosmendoza.com.ar/wp-content/uploads/2024/09/Aperitivo-Aperol-x-1-unidad.jpg", // Aperol Spritz
  negroni: "https://acdn-us.mitiendanube.com/stores/002/483/999/products/negroni-inmigrante-750ml1-1acfb91d3edae87d0216788332975444-480-0.webp", // Negroni
  mojito: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5PUWm-xgzWrKLknJcCfPF_ge-CxjnJdnW7dLAt92WSQ&s=10", // Mojito
  caipirinha: "https://images.ctfassets.net/6zncp07wiqyq/6GLsH6cDxg5Fggr4HmTn7v/46c23afe2363ea6cfc32fd1b1a50353f/media_i0ghlxbl_mexican-caipirinha.jpg", // Caipirinha
  daiquiri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsWQgSmehEyh-UBM6iYNo9s92Y9jOB34IfLaEl9QoqFQ&s=10", // Daiquiri
  margarita: "https://s3-eu-west-1.amazonaws.com/verem/images/valoraciones/0016/3319/margarita-2.jpg?1449839402", // Margarita
  "tequila-sunrise": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_PJMiiuSaggOewvhDJY8hFmeUY3aiWxJ_ZKcUA0U_CYQmxZQpreDP6kA&s=10", // Tequila Sunrise
  clerico: "https://ardiaprod.vtexassets.com/arquivos/ids/315367/Clerico-Fizz-del-Valle-710-Ml-_1.jpg?v=638599440996230000", // Clerico
  sangria: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEasrHa0NBPD5bIfj35exweJ_ckFtJ3FujdcZsi2WukmXKw3_-FG0CzJY&s=10", // Sangria
  "vino-soda": "https://feltonbebidas.com.ar/wp-content/uploads/2024/09/BUM-BUM-SODA-WEB-600-X600.jpg", // Vino con soda
  michelada: "https://img.magnific.com/foto-gratis/coctel-michelada-casero-jugo-lima-cervezasalsa-picantelim-salado-jugo-tomate-aislado_123827-21709.jpg?semt=ais_hybrid&w=740&q=80", // Michelada
  otra: "https://s3-eu-west-1.amazonaws.com/verema/blog/jordi/uploaded_images/la-botella-misteriosa-749129.jpg", // Otra bebida
};

// clave (id del ingrediente)  ->  link de la foto  (armador "Arma tu trago")
export const INGREDIENT_IMAGES: Record<string, string> = {
  gin: "https://masonlineprod.vtexassets.com/arquivos/ids/224748-800-auto?v=637855393026730000&width=800&height=auto&aspect=true", // Gin
  vodka: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKV4Zvqi3Ve_3HFw9Ge4JqS2oRTklTxexyW1J8EALpO8KyVkzvDu0x6Vk&s=10", // Vodka
  ron: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROGzMTX2ULH2E9KuEGFs1GeDMufIBA6kKz-8fWQlM_x7rAoE4YFAkoiMlf&s=10", // Ron
  tequila: "https://http2.mlstatic.com/D_NQ_NP_901618-MLU78193451270_082024-F.jpg", // Tequila
  whisky: "https://acdn-us.mitiendanube.com/stores/002/483/999/products/johnnie-walker-red-750ml1-189a174b25106a47e116787441723435-480-0.webp", // Whisky
  fernet: "https://acdn-us.mitiendanube.com/stores/006/757/969/products/38-c1631ba24e622cb6b217750533905044-1024-1024.webp", // Fernet
  aperol: "https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/3070683_f.jpg", // Aperol
  campari: "https://ardiaprod.vtexassets.com/arquivos/ids/332536/Aperitivo-Campari-Bitter-750-ml-_2.jpg?v=638619040585000000", // Campari
  vermut: "https://acdn-us.mitiendanube.com/stores/002/483/999/products/cinzano-rosso-1000ml1-4b00ec21bb0e1d865a16788328410964-480-0.webp", // Vermut
  licor: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqapD-P9Vf1ee7Spui9IS_xY2hAY1QMm5TWs2jeXbkRNIaVsucfBcxa5dR&s=10", // Licor dulce
  espumante: "https://cepadevinos.com/wp-content/uploads/2017/07/Baron_B_Extra_Brut_bvcpfz.jpg", // Espumante
  cola: "https://www.casa-segal.com/wp-content/uploads/2026/01/coca-cola-1lt.png", // Coca / cola
  tonica: "https://jumboargentina.vtexassets.com/arquivos/ids/782870/Gaseosa-Schweppes-T-nica-1-5-L-2-245090.jpg?v=638206689956570000", // Agua tonica
  soda: "https://jumboargentina.vtexassets.com/arquivos/ids/853157/Soda-Cuisine-Co-1-75lt-2-879885.jpg?v=638826506325130000", // Soda
  "jugo-naranja": "https://www.smartnfinal.com.mx/wp-content/uploads/2025/10/129634-JUGO-DE-NARANJA-PREMIUM-SIN-PULPA-TROPICANA-1.36L.jpg", // Jugo de naranja
  "jugo-anana": "https://arcordiezb2c.vteximg.com.br/arquivos/ids/176632/Jugo-Anana-Cepita-1500-Cc-1-14368.jpg?v=638056137653270000", // Jugo de anana
  "jugo-pomelo": "https://jumboargentina.vtexassets.com/arquivos/ids/684678/Jugo-Citric-Pomelo-500ml-1-883120.jpg?v=637780305802970000", // Jugo de pomelo
  hielo: "https://acdn-us.mitiendanube.com/stores/006/104/650/products/bolsa-hielo-x1-kg-6-1-f4dcdc0ba95f6f45ac17448434983012-1024-1024.webp", // Hielo
};

export function drinkImage(id: string): string | undefined {
  const url = DRINK_IMAGES[id];
  return url && url.trim() ? url : undefined;
}

export function ingredientImage(id: string): string | undefined {
  const url = INGREDIENT_IMAGES[id];
  return url && url.trim() ? url : undefined;
}

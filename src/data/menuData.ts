
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  priceFamily?: number;
  category: string;
  image?: string;
  ingredients?: string[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  size?: 'grande' | 'familia';
  selectedPrice: number;
}

export const menuCategories = [
  { id: 'sanduiches', name: 'Sanduíches', icon: '🥪' },
  { id: 'pizzas', name: 'Pizzas', icon: '🍕' },
  { id: 'pasteis', name: 'Pastéis', icon: '🥟' },
  { id: 'bebidas', name: 'Bebidas', icon: '🥤' },
  { id: 'combos', name: 'Combos', icon: '🍔' },
  { id: 'adicionais', name: 'Adicionais', icon: '➕' }
];

export const menuItems: MenuItem[] = [
  // Sanduíches de Carne
  {
    id: 'hamburguer',
    name: 'Hambúrguer',
    description: 'Carne, tomate e alface',
    price: 14.00,
    category: 'sanduiches'
  },
  {
    id: 'x-burguer',
    name: 'X-Burguer',
    description: 'Carne, queijo, tomate e alface',
    price: 17.00,
    category: 'sanduiches'
  },
  {
    id: 'eggs-burguer',
    name: 'Eggs Burguer',
    description: 'Carne, ovo, tomate e alface',
    price: 17.00,
    category: 'sanduiches'
  },
  {
    id: 'pre-x-burguer',
    name: 'Pré X-Burguer',
    description: 'Carne, queijo, presunto, tomate e alface',
    price: 19.50,
    category: 'sanduiches'
  },
  {
    id: 'x-bacon',
    name: 'X-Bacon',
    description: 'Carne, queijo, bacon, tomate e alface',
    price: 19.50,
    category: 'sanduiches'
  },
  {
    id: 'x-hawai',
    name: 'X-Hawaii',
    description: 'Carne, queijo, presunto, bacon, tomate e alface',
    price: 20.00,
    category: 'sanduiches'
  },
  {
    id: 'x-salada',
    name: 'X-Salada',
    description: 'Carne, queijo, bacon, ovo, tomate e alface',
    price: 20.00,
    category: 'sanduiches'
  },
  {
    id: 'americano',
    name: 'Americano',
    description: 'Carne, queijo, ovo, tomate e alface',
    price: 19.50,
    category: 'sanduiches'
  },
  {
    id: 'bauru',
    name: 'Bauru',
    description: 'Carne, queijo, presunto, ovo, tomate e alface',
    price: 20.00,
    category: 'sanduiches'
  },
  {
    id: 'a-moda',
    name: 'À Moda',
    description: 'Carne, queijo, presunto, bacon, ovo, tomate e alface',
    price: 21.00,
    category: 'sanduiches'
  },
  {
    id: 'x-calabresa',
    name: 'X-Calabresa',
    description: 'Carne, queijo, calabresa, tomate e alface',
    price: 19.50,
    category: 'sanduiches'
  },
  {
    id: 'misto-calabresa',
    name: 'Misto Calabresa',
    description: 'Presunto, queijo, calabresa, tomate e alface',
    price: 19.50,
    category: 'sanduiches'
  },
  {
    id: 'big-bagunca',
    name: 'Big Bagunça',
    description: 'Carne, queijo, presunto, bacon, ovo, salsicha, tomate e alface',
    price: 21.50,
    category: 'sanduiches'
  },
  {
    id: 'x-tudo',
    name: 'X-Tudo',
    description: 'Carne, frango, queijo, presunto, bacon, ovo, salsicha, tomate e alface',
    price: 35.00,
    category: 'sanduiches'
  },

  // Sanduíches de Frango
  {
    id: 'frango-verdura',
    name: 'Frango c/ Verdura',
    description: 'Frango, milho, tomate e alface',
    price: 18.00,
    category: 'sanduiches'
  },
  {
    id: 'x-frango',
    name: 'X-Frango',
    description: 'Frango, queijo, milho, tomate e alface',
    price: 19.50,
    category: 'sanduiches'
  },
  {
    id: 'francatu',
    name: 'Francatu',
    description: 'Frango, queijo, catupiry, milho, tomate e alface',
    price: 20.00,
    category: 'sanduiches'
  },
  {
    id: 'x-frango-moda',
    name: 'X-Frango à Moda',
    description: 'Frango, queijo, bacon, milho, tomate e alface',
    price: 20.00,
    category: 'sanduiches'
  },
  {
    id: 'top-frango',
    name: 'Top Frango',
    description: 'Frango, queijo, calabresa, milho, tomate e alface',
    price: 20.00,
    category: 'sanduiches'
  },
  {
    id: 'super-frango',
    name: 'Super Frango',
    description: 'Frango, queijo, presunto, bacon, milho, tomate e alface',
    price: 20.50,
    category: 'sanduiches'
  },
  {
    id: 'master-frango',
    name: 'Master Frango',
    description: 'Frango, queijo, presunto, tomate e alface',
    price: 20.00,
    category: 'sanduiches'
  },
  {
    id: 'super-calabresa',
    name: 'Super Calabresa',
    description: 'Frango, queijo, presunto, ovo, calabresa, milho, tomate e alface',
    price: 21.00,
    category: 'sanduiches'
  },
  {
    id: 'big-super',
    name: 'Big Super',
    description: 'Frango, queijo, presunto, salsicha, milho, tomate e alface',
    price: 20.50,
    category: 'sanduiches'
  },
  {
    id: 'frango-especial',
    name: 'Frango Especial',
    description: 'Frango, queijo, presunto, bacon, salsicha, ovo, milho, tomate e alface',
    price: 23.00,
    category: 'sanduiches'
  },
  {
    id: 'frango-cheddar',
    name: 'Frango c/ Cheddar',
    description: 'Frango, queijo, bacon, cheddar, milho, tomate e alface',
    price: 21.90,
    category: 'sanduiches'
  },

  // Sanduíches Carne do Sol
  {
    id: 'carne-sol',
    name: 'Carne do Sol',
    description: 'Carne do sol, queijo, ovo, tomate e alface',
    price: 22.00,
    category: 'sanduiches'
  },
  {
    id: 'carne-sol-cream',
    name: 'Carne do Sol c/ Cream Cheese',
    description: 'Carne do sol, queijo, cream cheese, tomate e alface',
    price: 25.00,
    category: 'sanduiches'
  },

  // Pizzas Clássicas
  {
    id: 'pizza-mista',
    name: 'Mista',
    description: 'Molho especial, mussarela, presunto, orégano e tomate',
    price: 30.00,
    priceFamily: 40.00,
    category: 'pizzas'
  },
  {
    id: 'pizza-calabresa',
    name: 'Calabresa',
    description: 'Molho especial, calabresa, mussarela, orégano, tomate e cebola',
    price: 32.00,
    priceFamily: 42.00,
    category: 'pizzas'
  },
  {
    id: 'pizza-mussarela',
    name: 'Mussarela',
    description: 'Molho especial, mussarela, orégano, tomate e azeitona',
    price: 32.00,
    priceFamily: 42.00,
    category: 'pizzas'
  },
  {
    id: 'pizza-frango',
    name: 'Frango',
    description: 'Molho especial, frango, mussarela, azeitona, tomate, milho e orégano',
    price: 32.00,
    priceFamily: 42.00,
    category: 'pizzas'
  },
  {
    id: 'pizza-portuguesa',
    name: 'Portuguesa',
    description: 'Molho especial, mussarela, presunto, ovo, cebola, azeitona, tomate, pimentão e orégano',
    price: 32.00,
    priceFamily: 42.00,
    category: 'pizzas'
  },

  // Pizzas Especiais
  {
    id: 'pizza-frango-cream',
    name: 'Frango c/ Cream Cheese',
    description: 'Molho especial, frango, mussarela, milho, cream cheese, tomate, orégano e milho',
    price: 40.00,
    priceFamily: 50.00,
    category: 'pizzas'
  },
  {
    id: 'pizza-toscana',
    name: 'Toscana',
    description: 'Molho especial, calabresa, mussarela, bacon, catupiry, tomate, orégano e milho',
    price: 35.00,
    priceFamily: 45.00,
    category: 'pizzas'
  },
  {
    id: 'pizza-mineira',
    name: 'Mineira',
    description: 'Molho especial, mussarela, catupiry, milho, tomate e orégano',
    price: 40.00,
    priceFamily: 50.00,
    category: 'pizzas'
  },
  {
    id: 'pizza-4-queijos',
    name: '4 Queijos',
    description: 'Molho especial, mussarela, queijo coalho, catupiry, cheddar, orégano',
    price: 40.00,
    priceFamily: 50.00,
    category: 'pizzas'
  },
  {
    id: 'pizza-paulista',
    name: 'Paulista',
    description: 'Molho especial, mussarela, presunto, ovo, cebola e orégano',
    price: 35.00,
    priceFamily: 55.00,
    category: 'pizzas'
  },
  {
    id: 'pizza-frango-bacon',
    name: 'Frango c/ Bacon',
    description: 'Molho especial, mussarela, frango, bacon, milho, tomate e azeitona',
    price: 40.00,
    priceFamily: 50.00,
    category: 'pizzas'
  },

  // Pastéis Salgados
  {
    id: 'pastel-queijo',
    name: 'Queijo',
    description: 'Queijo',
    price: 12.00,
    category: 'pasteis'
  },
  {
    id: 'pastel-misto',
    name: 'Misto',
    description: 'Queijo e presunto',
    price: 13.00,
    category: 'pasteis'
  },
  {
    id: 'pastel-carne-sol',
    name: 'Carne do Sol',
    description: 'Carne do sol e queijo',
    price: 23.00,
    category: 'pasteis'
  },
  {
    id: 'pastel-carne-sol-cream',
    name: 'Carne do Sol c/ Cream Cheese',
    description: 'Carne do sol e cream cheese',
    price: 25.00,
    category: 'pasteis'
  },
  {
    id: 'pastel-carne',
    name: 'Carne',
    description: 'Carne, queijo e milho',
    price: 18.50,
    category: 'pasteis'
  },
  {
    id: 'pastel-carne-cream',
    name: 'Carne c/ Cream Cheese',
    description: 'Carne, queijo, milho e cream cheese',
    price: 22.00,
    category: 'pasteis'
  },
  {
    id: 'pastel-top',
    name: 'Top Pastel',
    description: 'Frango, queijo, calabresa e milho',
    price: 19.50,
    category: 'pasteis'
  },
  {
    id: 'pastel-master',
    name: 'Master Pastel',
    description: 'Frango, queijo, presunto e milho',
    price: 19.50,
    category: 'pasteis'
  },
  {
    id: 'pastel-frango-catupiry',
    name: 'Frango c/ Catupiry',
    description: 'Frango, queijo, milho e catupiry',
    price: 22.00,
    category: 'pasteis'
  },
  {
    id: 'pastel-cream-cheese',
    name: 'Cream Cheese',
    description: 'Frango, queijo, milho e cream cheese',
    price: 23.00,
    category: 'pasteis'
  },
  {
    id: 'pastel-frango-queijo',
    name: 'Pastel Frango c/ Queijo',
    description: 'Frango, queijo e milho',
    price: 18.50,
    category: 'pasteis'
  },
  {
    id: 'pastel-mistao',
    name: 'Mistão',
    description: 'Carne, queijo, frango, presunto, calabresa e milho',
    price: 21.00,
    category: 'pasteis'
  },
  {
    id: 'pastel-frango-bacon',
    name: 'Frango c/ Bacon',
    description: 'Frango, queijo, bacon e milho',
    price: 18.50,
    category: 'pasteis'
  },

  // Pastéis Doces
  {
    id: 'pastel-doce-kitkat',
    name: 'Kit-Kat',
    description: 'Chocolate e Kit Kat',
    price: 25.00,
    category: 'pasteis'
  },
  {
    id: 'pastel-doce-alpino',
    name: 'Alpino',
    description: 'Chocolate Alpino',
    price: 25.00,
    category: 'pasteis'
  },
  {
    id: 'pastel-doce-chocolate',
    name: 'Chocolate',
    description: 'Chocolate ao leite',
    price: 25.00,
    category: 'pasteis'
  },
  {
    id: 'pastel-doce-leite',
    name: 'Ao Leite',
    description: 'Doce de leite',
    price: 25.00,
    category: 'pasteis'
  },

  // Executivas
  {
    id: 'executiva-nordestina',
    name: 'Nordestina',
    description: 'Molho especial, mussarela, carne do sol, cebola, queijo coalho e orégano',
    price: 50.00,
    priceFamily: 60.00,
    category: 'pizzas'
  },
  {
    id: 'executiva-marguerita',
    name: 'Marguerita',
    description: 'Molho especial, mussarela, manjericão, azeite, tomate cereja e orégano',
    price: 40.00,
    priceFamily: 50.00,
    category: 'pizzas'
  },
  {
    id: 'executiva-camarao',
    name: 'Camarão',
    description: 'Molho especial, mussarela, camarão, cream cheese e orégano',
    price: 60.00,
    priceFamily: 70.00,
    category: 'pizzas'
  },
  {
    id: 'executiva-paulistana-mineira',
    name: 'Paulistana à Mineira',
    description: 'Molho especial, mussarela, frango, cebola, alho, pimentão, bacon e orégano',
    price: 42.00,
    priceFamily: 52.00,
    category: 'pizzas'
  },
  {
    id: 'executiva-4-queijos',
    name: '4 Queijos Executivo',
    description: 'Molho especial, mussarela, cream cheese, parmesão, gorgonzola e orégano',
    price: 55.00,
    priceFamily: 70.00,
    category: 'pizzas'
  },

  // Doces Pizza
  {
    id: 'pizza-doce-chocolate',
    name: 'Chocolate',
    description: 'Massa fina e chocolate',
    price: 38.00,
    priceFamily: 48.99,
    category: 'pizzas'
  },
  {
    id: 'pizza-doce-banana-canela',
    name: 'Banana c/ Canela',
    description: 'Banana, canela e chocolate branco',
    price: 42.00,
    priceFamily: 52.00,
    category: 'pizzas'
  },
  {
    id: 'pizza-doce-chocolate-mm',
    name: 'Chocolate c/ M&M',
    description: 'Chocolate e M&s',
    price: 32.00,
    priceFamily: 42.00,
    category: 'pizzas'
  },
  {
    id: 'pizza-doce-chocolate-morango',
    name: 'Chocolate c/ Morango',
    description: 'Chocolate e morango',
    price: 37.00,
    priceFamily: 47.00,
    category: 'pizzas'
  },
  {
    id: 'pizza-doce-kitkat',
    name: 'Kit Kat',
    description: 'Chocolate e Kit Kat',
    price: 32.00,
    priceFamily: 42.00,
    category: 'pizzas'
  },

  // Combos
  {
    id: 'combo-x-frango',
    name: 'Combo X-Frango',
    description: '1 X-Frango, 1 batata frita e 1 refrigerante lata',
    price: 31.00,
    category: 'combos'
  },
  {
    id: 'combo-bauru',
    name: 'Combo Bauru',
    description: '1 Bauru, 1 batata frita e 1 refrigerante lata',
    price: 31.00,
    category: 'combos'
  },
  {
    id: 'combo-casa',
    name: 'Combo da Casa',
    description: 'Super calabresa, 1 à moda, 1 batata frita, 1 refrigerante 1 litro',
    price: 52.00,
    category: 'combos'
  },
  {
    id: 'combo-casal',
    name: 'Combo Casal',
    description: '1 X-tudo, 1 batata frita, 1 refrigerante 600ml e torta de chocolate',
    price: 52.00,
    category: 'combos'
  },
  {
    id: 'combo-chefe',
    name: 'Combo Chefe',
    description: 'Master Frango, 1 big bagunça, 1 batata frita, 1 refrigerante 1L',
    price: 82.00,
    category: 'combos'
  },

  // Batata Frita
  {
    id: 'batata-simples',
    name: 'Batata Simples',
    description: 'Batata frita tradicional',
    price: 13.00,
    category: 'pasteis'
  },
  {
    id: 'batata-especial',
    name: 'Batata Especial',
    description: 'Batata, cheddar e bacon',
    price: 17.00,
    category: 'pasteis'
  },

  // Vitaminas
  {
    id: 'vitamina-acerola',
    name: 'Acerola',
    description: 'Vitamina de acerola',
    price: 9.00,
    category: 'bebidas'
  },
  {
    id: 'vitamina-goiaba',
    name: 'Goiaba',
    description: 'Vitamina de goiaba',
    price: 9.00,
    category: 'bebidas'
  },
  {
    id: 'vitamina-manga',
    name: 'Manga',
    description: 'Vitamina de manga',
    price: 9.00,
    category: 'bebidas'
  },
  {
    id: 'vitamina-caja',
    name: 'Cajá',
    description: 'Vitamina de cajá',
    price: 9.00,
    category: 'bebidas'
  },
  {
    id: 'vitamina-maracuja',
    name: 'Maracujá',
    description: 'Vitamina de maracujá',
    price: 9.00,
    category: 'bebidas'
  },
  {
    id: 'vitamina-morango',
    name: 'Morango',
    description: 'Vitamina de morango',
    price: 9.00,
    category: 'bebidas'
  },
  {
    id: 'vitamina-graviola',
    name: 'Graviola',
    description: 'Vitamina de graviola',
    price: 9.00,
    category: 'bebidas'
  },
  {
    id: 'vitamina-acai',
    name: 'Açaí',
    description: 'Vitamina de açaí',
    price: 15.00,
    category: 'bebidas'
  },

  // Milk Shakes
  {
    id: 'milkshake-chocolate',
    name: 'Milk de Chocolate',
    description: 'Milk shake de chocolate',
    price: 14.00,
    category: 'bebidas'
  },
  {
    id: 'milkshake-morango',
    name: 'Milk de Morango',
    description: 'Milk shake de morango',
    price: 14.00,
    category: 'bebidas'
  },
  {
    id: 'milkshake-ovomaltine',
    name: 'Milk de Ovomaltine',
    description: 'Milk shake de ovomaltine',
    price: 17.00,
    category: 'bebidas'
  },
  {
    id: 'milkshake-misto',
    name: 'Milk Misto',
    description: 'Milk shake misto',
    price: 14.00,
    category: 'bebidas'
  },

  // Bebidas
  {
    id: 'coca-2l',
    name: 'Coca 2 Litros',
    description: 'Refrigerante Coca-Cola 2L',
    price: 16.00,
    category: 'bebidas'
  },
  {
    id: 'coca-600ml',
    name: 'Coca 600ml',
    description: 'Refrigerante Coca-Cola 600ml',
    price: 8.00,
    category: 'bebidas'
  },
  {
    id: 'pepsi-1l',
    name: 'Pepsi 1L',
    description: 'Refrigerante Pepsi 1L',
    price: 10.00,
    category: 'bebidas'
  },
  {
    id: 'guarana-1l',
    name: 'Guaraná 1L',
    description: 'Refrigerante Guaraná 1L',
    price: 10.00,
    category: 'bebidas'
  },
  {
    id: 'agua-mineral',
    name: 'Água Mineral',
    description: 'Água mineral 500ml',
    price: 3.00,
    category: 'bebidas'
  },
  {
    id: 'refri-lata',
    name: 'Refri Lata 350ml',
    description: 'Refrigerante em lata 350ml',
    price: 6.00,
    category: 'bebidas'
  },

  // Adicionais
  {
    id: 'adicional-frango',
    name: 'Frango',
    description: 'Porção adicional de frango',
    price: 7.00,
    category: 'adicionais'
  },
  {
    id: 'adicional-bacon',
    name: 'Bacon',
    description: 'Porção adicional de bacon',
    price: 3.00,
    category: 'adicionais'
  },
  {
    id: 'adicional-carne-sol',
    name: 'Carne do Sol',
    description: 'Porção adicional de carne do sol',
    price: 10.00,
    category: 'adicionais'
  },
  {
    id: 'adicional-cheddar',
    name: 'Cheddar',
    description: 'Porção adicional de cheddar',
    price: 5.00,
    category: 'adicionais'
  },
  {
    id: 'adicional-cream-cheese',
    name: 'Cream Cheese',
    description: 'Porção adicional de cream cheese',
    price: 5.00,
    category: 'adicionais'
  },
  {
    id: 'adicional-presunto',
    name: 'Presunto',
    description: 'Porção adicional de presunto',
    price: 2.00,
    category: 'adicionais'
  },
  {
    id: 'adicional-salsicha',
    name: 'Salsicha',
    description: 'Porção adicional de salsicha',
    price: 2.00,
    category: 'adicionais'
  },

  // Bordas
  {
    id: 'borda-chocolate',
    name: 'Chocolate',
    description: 'Borda recheada com chocolate',
    price: 8.00,
    category: 'adicionais'
  },
  {
    id: 'borda-cheddar',
    name: 'Cheddar',
    description: 'Borda recheada com cheddar',
    price: 8.00,
    category: 'adicionais'
  },
  {
    id: 'borda-queijo-coalho',
    name: 'Queijo Coalho',
    description: 'Borda recheada com queijo coalho',
    price: 8.00,
    category: 'adicionais'
  },
  {
    id: 'borda-catupiry',
    name: 'Catupiry',
    description: 'Borda recheada com catupiry',
    price: 8.00,
    category: 'adicionais'
  }
];

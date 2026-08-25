const fs = require('fs');

const replacements = {
  'quan-ho-bac-ninh': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Li%C3%AAn_hoan_d%C3%A2n_ca_Quan_h%E1%BB%8D_B%E1%BA%AFc_Ninh.jpg/1280px-Li%C3%AAn_hoan_d%C3%A2n_ca_Quan_h%E1%BB%8D_B%E1%BA%AFc_Ninh.jpg',
  'nha-nhac-cung-dinh-hue': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Nha_nhac_cung_dinh_Hue_2012.jpg/1280px-Nha_nhac_cung_dinh_Hue_2012.jpg',
  'don-ca-tai-tu-nam-bo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Ban_nh%E1%BA%A1c_%C4%91%E1%BB%9Dn_ca_t%C3%A0i_t%E1%BB%AD_S%C3%A0i_G%C3%B2n_%281911%29.jpeg/1280px-Ban_nh%E1%BA%A1c_%C4%91%E1%BB%9Dn_ca_t%C3%A0i_t%E1%BB%AD_S%C3%A0i_G%C3%B2n_%281911%29.jpeg',
  'gom-su-bat-trang': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/B%C3%A1t_Tr%C3%A0ng_Ceramic_Village_6.jpg/1280px-B%C3%A1t_Tr%C3%A0ng_Ceramic_Village_6.jpg',
  'pho-co-hoi-an': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Hoi_An_Old_Town_in_the_evening.jpg/1280px-Hoi_An_Old_Town_in_the_evening.jpg',
  'trang-an-ninh-binh': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Trang_An_Landscape_Complex_3.jpg/1280px-Trang_An_Landscape_Complex_3.jpg',
  'cong-chieng-tay-nguyen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cong_chieng.jpg/1280px-Cong_chieng.jpg',
  'le-khao-le-the-linh-hoang-sa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/HoangSaDoi-DaiNamThucLuc.jpg/1280px-HoangSaDoi-DaiNamThucLuc.jpg',
  'vinh-ha-long': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/V%E1%BB%8Bnh_H%E1%BA%A1_Long_-_NKS.jpg/1280px-V%E1%BB%8Bnh_H%E1%BA%A1_Long_-_NKS.jpg',
  'hoang-thanh-thang-long': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Doan_Mon%2C_Hanoi.jpg/1280px-Doan_Mon%2C_Hanoi.jpg',
  'ca-tru-thang-long': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Ca_tr%C3%B9.jpg/1280px-Ca_tr%C3%B9.jpg',
  'tin-nguong-hung-vuong': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Den_Hung_%282%29.jpg/1280px-Den_Hung_%282%29.jpg',
  'thuc-hanh-then-viet-bac': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/T%C3%A0y_people_playing_T%C3%ADnh_t%E1%BA%A3u_2.jpg/1280px-T%C3%A0y_people_playing_T%C3%ADnh_t%E1%BA%A3u_2.jpg',
  'ruong-bac-thang-mu-cang-chai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Terraced_rice_fields_in_Mu_Cang_Chai_3.jpg/1280px-Terraced_rice_fields_in_Mu_Cang_Chai_3.jpg',
  'quan-the-di-tich-hue': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Ngo_Mon%2C_Hue_1.jpg/1280px-Ngo_Mon%2C_Hue_1.jpg',
  'thanh-dia-my-son': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/My_Son_Sanctuary_12.jpg/1280px-My_Son_Sanctuary_12.jpg',
  'phong-nha-ke-bang': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Phong_Nha_Cave_-_Quang_Binh_Province.jpg/1280px-Phong_Nha_Cave_-_Quang_Binh_Province.jpg',
  'bai-choi-trung-bo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/B%C3%A0i_ch%C3%B2i_H%E1%BB%99i_An_2.jpg/1280px-B%C3%A0i_ch%C3%B2i_H%E1%BB%99i_An_2.jpg',
  'dan-ca-vi-giam-nghe-tinh': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Ho_Chu_Tich_voi_nghe_si_Nghe_Tinh.jpg/1280px-Ho_Chu_Tich_voi_nghe_si_Nghe_Tinh.jpg',
  'thanh-nha-ho': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/C%E1%BB%95ng_Nam_Th%C3%A0nh_Nh%C3%A0_H%E1%BB%93.jpg/1280px-C%E1%BB%95ng_Nam_Th%C3%A0nh_Nh%C3%A0_H%E1%BB%93.jpg',
  'ba-chua-xu-nui-sam': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Mieu_Ba_Chua_Xu_Nui_Sam_2019.jpg/1280px-Mieu_Ba_Chua_Xu_Nui_Sam_2019.jpg',
  'du-ke-khmer-nam-bo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/S%C3%B3c_Tr%C4%83ng_Khmer_Dance.jpg/1280px-S%C3%B3c_Tr%C4%83ng_Khmer_Dance.jpg',
  'cho-noi-cai-rang': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Cai_Rang_Floating_Market_Can_Tho_Vietnam.jpg/1280px-Cai_Rang_Floating_Market_Can_Tho_Vietnam.jpg',
  'banh-trang-phoi-suong-trang-bang': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/B%C3%A1nh_tr%C3%A1ng_ph%C6%A1i_s%C6%B0%C6%A1ng.jpg/1280px-B%C3%A1nh_tr%C3%A1ng_ph%C6%A1i_s%C6%B0%C6%A1ng.jpg',
  'gom-cham-bau-truc': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/G%E1%BB%91m_B%C3%A0u_Tr%C3%BAc_2021.jpg/1280px-G%E1%BB%91m_B%C3%A0u_Tr%C3%BAc_2021.jpg'
};

const filePath = 'src/data/heritageKnowledge.ts';
let content = fs.readFileSync(filePath, 'utf8');

for (const [id, url] of Object.entries(replacements)) {
  const regex = new RegExp(`(id:\\s*'${id}'[\\s\\S]*?heroImage:\\s*')[^']+(')`, 'g');
  content = content.replace(regex, `$1${url}$2`);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Images updated successfully');

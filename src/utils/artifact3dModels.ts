import * as THREE from 'three';

export function buildArtifactGeometry(artifactId: string, group: THREE.Group, isHologram: boolean) {
  // Clear existing meshes
  while (group.children.length > 0) {
    const child = group.children[0];
    group.remove(child);
    if ((child as any).geometry) (child as any).geometry.dispose();
  }

  // Material Palette
  const bronzeMat = isHologram
    ? new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.15, metalness: 0.95, emissive: 0xb45309, emissiveIntensity: 0.35 })
    : new THREE.MeshStandardMaterial({ color: 0xa16207, roughness: 0.35, metalness: 0.85 });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    roughness: 0.18,
    metalness: 0.95,
  });

  const ceramicMat = isHologram
    ? new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.8, emissive: 0x0284c7, emissiveIntensity: 0.3 })
    : new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.18, metalness: 0.12 });

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.55, metalness: 0.05 });
  const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.5, metalness: 0.05 });
  const vermilionMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.45, metalness: 0.1 });
  const sandstoneMat = new THREE.MeshStandardMaterial({ color: 0xa8a29e, roughness: 0.8, metalness: 0.05 });
  const palmLeafMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.65, metalness: 0.05, side: THREE.DoubleSide });
  const silkLanternMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.45,
    emissive: 0xd97706,
    emissiveIntensity: 0.4,
  });

  switch (artifactId) {
    case 'trong-dong': {
      // 1. Dong Son Bronze Drum (Ngoc Lu I)
      const topGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.08, 48);
      const topMesh = new THREE.Mesh(topGeo, bronzeMat);
      topMesh.position.y = 0.9;
      group.add(topMesh);

      const starGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.1, 14);
      const starMesh = new THREE.Mesh(starGeo, goldMat);
      starMesh.position.y = 0.92;
      group.add(starMesh);

      const upperGeo = new THREE.CylinderGeometry(1.28, 0.95, 0.6, 48, 1, true);
      const upperMesh = new THREE.Mesh(upperGeo, bronzeMat);
      upperMesh.position.y = 0.6;
      group.add(upperMesh);

      const waistGeo = new THREE.CylinderGeometry(0.95, 0.95, 0.7, 48, 1, true);
      const waistMesh = new THREE.Mesh(waistGeo, bronzeMat);
      waistMesh.position.y = -0.05;
      group.add(waistMesh);

      const baseGeo = new THREE.CylinderGeometry(0.95, 1.4, 0.65, 48, 1, true);
      const baseMesh = new THREE.Mesh(baseGeo, bronzeMat);
      baseMesh.position.y = -0.7;
      group.add(baseMesh);

      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const handleGeo = new THREE.TorusGeometry(0.2, 0.04, 16, 32, Math.PI);
        const handleMesh = new THREE.Mesh(handleGeo, bronzeMat);
        handleMesh.position.set(Math.cos(angle) * 1.05, 0.3, Math.sin(angle) * 1.05);
        handleMesh.rotation.y = angle;
        handleMesh.rotation.z = Math.PI / 2;
        group.add(handleMesh);
      }
      break;
    }

    case 'binh-gom': {
      // 2. Bat Trang Crackle Glaze Ceramic Vase
      const bodyGeo = new THREE.SphereGeometry(1.0, 32, 24);
      bodyGeo.scale(1, 1.3, 1);
      const bodyMesh = new THREE.Mesh(bodyGeo, ceramicMat);
      bodyMesh.position.y = 0;
      group.add(bodyMesh);

      const neckGeo = new THREE.CylinderGeometry(0.38, 0.55, 0.8, 32);
      const neckMesh = new THREE.Mesh(neckGeo, ceramicMat);
      neckMesh.position.y = 1.2;
      group.add(neckMesh);

      const rimGeo = new THREE.TorusGeometry(0.48, 0.08, 16, 32);
      const rimMesh = new THREE.Mesh(rimGeo, ceramicMat);
      rimMesh.position.y = 1.6;
      rimMesh.rotation.x = Math.PI / 2;
      group.add(rimMesh);

      const footGeo = new THREE.CylinderGeometry(0.65, 0.75, 0.3, 32);
      const footMesh = new THREE.Mesh(footGeo, ceramicMat);
      footMesh.position.y = -1.2;
      group.add(footMesh);

      const bandGeo = new THREE.TorusGeometry(0.98, 0.04, 16, 48);
      const bandMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.2 });
      const bandMesh = new THREE.Mesh(bandGeo, bandMat);
      bandMesh.position.y = 0.2;
      bandMesh.rotation.x = Math.PI / 2;
      group.add(bandMesh);
      break;
    }

    case 'den-long': {
      // 3. Hoi An Silk Lantern
      const lanternGeo = new THREE.SphereGeometry(1.1, 32, 24);
      lanternGeo.scale(1, 1.25, 1);
      const lanternMesh = new THREE.Mesh(lanternGeo, silkLanternMat);
      lanternMesh.position.y = 0.2;
      group.add(lanternMesh);

      const innerLight = new THREE.PointLight(0xfef08a, 3.5, 6);
      innerLight.position.y = 0.2;
      group.add(innerLight);

      const topCollarGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.15, 32);
      const topCollar = new THREE.Mesh(topCollarGeo, woodMat);
      topCollar.position.y = 1.55;
      group.add(topCollar);

      const botCollarGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.15, 32);
      const botCollar = new THREE.Mesh(botCollarGeo, woodMat);
      botCollar.position.y = -1.15;
      group.add(botCollar);

      const tasselGeo = new THREE.CylinderGeometry(0.08, 0.25, 0.9, 16);
      const tasselMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.7 });
      const tassel = new THREE.Mesh(tasselGeo, tasselMat);
      tassel.position.y = -1.65;
      group.add(tassel);
      break;
    }

    case 'kim-bao': {
      // 4. Imperial Gold Seal (Hoang De Chi Bao)
      const baseGeo = new THREE.BoxGeometry(1.8, 0.45, 1.8);
      const baseMesh = new THREE.Mesh(baseGeo, goldMat);
      baseMesh.position.y = -0.5;
      group.add(baseMesh);

      const dragonBodyGeo = new THREE.TorusGeometry(0.65, 0.22, 16, 32, Math.PI * 1.5);
      const dragonBody = new THREE.Mesh(dragonBodyGeo, goldMat);
      dragonBody.position.y = 0.3;
      dragonBody.rotation.x = Math.PI / 2;
      group.add(dragonBody);

      const headGeo = new THREE.ConeGeometry(0.32, 0.65, 16);
      const headMesh = new THREE.Mesh(headGeo, goldMat);
      headMesh.position.set(0.6, 0.6, 0);
      headMesh.rotation.z = -Math.PI / 3;
      group.add(headMesh);
      break;
    }

    case 'dan-kim': {
      // 5. Southern Moon Lute (Dan Kim)
      const bodyGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.22, 48);
      const bodyMesh = new THREE.Mesh(bodyGeo, woodMat);
      bodyMesh.position.y = -0.5;
      bodyMesh.rotation.x = Math.PI / 2;
      group.add(bodyMesh);

      const neckGeo = new THREE.BoxGeometry(0.12, 2.2, 0.08);
      const neckMesh = new THREE.Mesh(neckGeo, woodMat);
      neckMesh.position.y = 0.8;
      group.add(neckMesh);

      const headGeo = new THREE.BoxGeometry(0.25, 0.45, 0.1);
      const headMesh = new THREE.Mesh(headGeo, goldMat);
      headMesh.position.y = 1.95;
      group.add(headMesh);

      for (let i = 0; i < 8; i++) {
        const fretGeo = new THREE.BoxGeometry(0.14, 0.03, 0.04);
        const fretMesh = new THREE.Mesh(fretGeo, goldMat);
        fretMesh.position.set(0, 0.1 + i * 0.22, 0.06);
        group.add(fretMesh);
      }
      break;
    }

    case 'non-la': {
      // 6. Hue Poem Conical Hat (Non La Bai Tho)
      // Main Palm Leaf Cone
      const coneGeo = new THREE.ConeGeometry(1.65, 0.95, 48, 1, true);
      const coneMesh = new THREE.Mesh(coneGeo, palmLeafMat);
      coneMesh.position.y = 0.2;
      group.add(coneMesh);

      // Top Cap Ornament
      const capGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const capMesh = new THREE.Mesh(capGeo, goldMat);
      capMesh.position.y = 0.72;
      group.add(capMesh);

      // 8 Bamboo Rib Rings stacked
      for (let i = 1; i <= 8; i++) {
        const radius = (1.65 * i) / 8.5;
        const heightOffset = 0.2 - (0.95 * (i - 1)) / 16;
        const ringGeo = new THREE.TorusGeometry(radius, 0.015, 8, 36);
        const ringMesh = new THREE.Mesh(ringGeo, woodMat);
        ringMesh.position.y = heightOffset;
        ringMesh.rotation.x = Math.PI / 2;
        group.add(ringMesh);
      }

      // Purple Silk Chinstrap (Quai non lua tim Hue)
      const strapGeo = new THREE.TorusGeometry(0.7, 0.03, 8, 32, Math.PI);
      const strapMat = new THREE.MeshStandardMaterial({ color: 0x9333ea, roughness: 0.5 });
      const strapMesh = new THREE.Mesh(strapGeo, strapMat);
      strapMesh.position.set(0, -0.28, 0);
      strapMesh.rotation.z = Math.PI;
      group.add(strapMesh);
      break;
    }

    case 'dan-bau': {
      // 7. Vietnamese Monochord (Dan Bau / Doc Huyen Cam)
      // Long Resonant Soundbox
      const bodyGeo = new THREE.BoxGeometry(0.38, 0.16, 2.7);
      const bodyMesh = new THREE.Mesh(bodyGeo, darkWoodMat);
      bodyMesh.position.y = -0.1;
      group.add(bodyMesh);

      // Soundboard Face Top
      const topGeo = new THREE.BoxGeometry(0.34, 0.03, 2.65);
      const topMat = new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.4 });
      const topMesh = new THREE.Mesh(topGeo, topMat);
      topMesh.position.set(0, 0, 0);
      group.add(topMesh);

      // Dried Acoustic Gourd Amplifier (Qua bau kho)
      const gourdGeo = new THREE.SphereGeometry(0.22, 24, 24);
      gourdGeo.scale(0.85, 1.3, 0.85);
      const gourdMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5, metalness: 0.1 });
      const gourdMesh = new THREE.Mesh(gourdGeo, gourdMat);
      gourdMesh.position.set(0, 0.32, 1.05);
      group.add(gourdMesh);

      // Flexible Buffalo Horn Lever (Can dan sung trau)
      const leverGeo = new THREE.CylinderGeometry(0.025, 0.04, 0.85, 16);
      const hornMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.3, metalness: 0.2 });
      const leverMesh = new THREE.Mesh(leverGeo, hornMat);
      leverMesh.position.set(0, 0.5, 1.05);
      leverMesh.rotation.x = -Math.PI / 8;
      group.add(leverMesh);

      // Single Metallic String
      const stringGeo = new THREE.CylinderGeometry(0.008, 0.008, 2.2, 8);
      const stringMesh = new THREE.Mesh(stringGeo, goldMat);
      stringMesh.position.set(0, 0.12, -0.05);
      stringMesh.rotation.x = Math.PI / 2;
      group.add(stringMesh);
      break;
    }

    case 'khue-van-cac': {
      // 8. Khue Van Cac Pavilion (Temple of Literature)
      // Stone Square Base
      const baseGeo = new THREE.BoxGeometry(1.8, 0.3, 1.8);
      const stoneMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.8 });
      const baseMesh = new THREE.Mesh(baseGeo, stoneMat);
      baseMesh.position.y = -0.7;
      group.add(baseMesh);

      // 4 Vermilion Pillars
      const pillarOffsets = [
        [-0.6, -0.6],
        [0.6, -0.6],
        [-0.6, 0.6],
        [0.6, 0.6],
      ];
      pillarOffsets.forEach(([px, pz]) => {
        const pillarGeo = new THREE.CylinderGeometry(0.07, 0.07, 1.1, 16);
        const pillarMesh = new THREE.Mesh(pillarGeo, vermilionMat);
        pillarMesh.position.set(px, -0.1, pz);
        group.add(pillarMesh);
      });

      // Upper Pavilion Chamber
      const chamberGeo = new THREE.BoxGeometry(1.3, 0.75, 1.3);
      const chamberMesh = new THREE.Mesh(chamberGeo, vermilionMat);
      chamberMesh.position.y = 0.55;
      group.add(chamberMesh);

      // Circular Sunburst Windows on front and sides (Cua so tron sao Khue)
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const windowGeo = new THREE.TorusGeometry(0.24, 0.035, 16, 24);
        const windowMesh = new THREE.Mesh(windowGeo, goldMat);
        windowMesh.position.set(Math.sin(angle) * 0.66, 0.55, Math.cos(angle) * 0.66);
        windowMesh.rotation.y = angle;
        group.add(windowMesh);
      }

      // Double-Tier Roof (Mai chong diem)
      const lowerRoofGeo = new THREE.ConeGeometry(1.65, 0.35, 4);
      const lowerRoof = new THREE.Mesh(lowerRoofGeo, vermilionMat);
      lowerRoof.position.y = 1.05;
      lowerRoof.rotation.y = Math.PI / 4;
      group.add(lowerRoof);

      const upperRoofGeo = new THREE.ConeGeometry(1.3, 0.45, 4);
      const upperRoof = new THREE.Mesh(upperRoofGeo, vermilionMat);
      upperRoof.position.y = 1.35;
      upperRoof.rotation.y = Math.PI / 4;
      group.add(upperRoof);
      break;
    }

    case 'thuyen-rong': {
      // 9. Hue Royal Dragon Boat (Long Chau)
      // Hull of the Boat
      const hullGeo = new THREE.CylinderGeometry(0.45, 0.25, 2.9, 16);
      hullGeo.scale(1.2, 0.7, 1);
      const hullMesh = new THREE.Mesh(hullGeo, darkWoodMat);
      hullMesh.position.y = -0.35;
      hullMesh.rotation.z = Math.PI / 2;
      group.add(hullMesh);

      // Gilded Dragon Head Prow (Dau rong)
      const dragonHeadGeo = new THREE.ConeGeometry(0.35, 0.7, 16);
      const dragonHead = new THREE.Mesh(dragonHeadGeo, goldMat);
      dragonHead.position.set(1.55, 0.1, 0);
      dragonHead.rotation.z = -Math.PI / 3;
      group.add(dragonHead);

      const dragonHornGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.4, 8);
      const dragonHorn = new THREE.Mesh(dragonHornGeo, goldMat);
      dragonHorn.position.set(1.6, 0.42, 0);
      dragonHorn.rotation.z = -Math.PI / 6;
      group.add(dragonHorn);

      // Royal Pavilion Cabin (Khoang ngu hoang gia)
      const cabinGeo = new THREE.BoxGeometry(0.9, 0.55, 0.7);
      const cabinMesh = new THREE.Mesh(cabinGeo, vermilionMat);
      cabinMesh.position.y = 0.05;
      group.add(cabinMesh);

      // Curved Gilded Cabin Roof
      const roofGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.0, 16, 1, false, 0, Math.PI);
      const roofMesh = new THREE.Mesh(roofGeo, goldMat);
      roofMesh.position.y = 0.35;
      roofMesh.rotation.z = Math.PI / 2;
      group.add(roofMesh);

      // Dragon Tail Stern
      const tailGeo = new THREE.ConeGeometry(0.2, 0.6, 12);
      const tailMesh = new THREE.Mesh(tailGeo, goldMat);
      tailMesh.position.set(-1.55, 0.05, 0);
      tailMesh.rotation.z = Math.PI / 3;
      group.add(tailMesh);
      break;
    }

    case 'tuong-cham':
    default: {
      // 10. Apsara Dancing Maiden of My Son (Tra Kieu)
      // Double Lotus Pedestal
      const baseGeo = new THREE.CylinderGeometry(0.7, 0.8, 0.35, 32);
      const baseMesh = new THREE.Mesh(baseGeo, sandstoneMat);
      baseMesh.position.y = -0.75;
      group.add(baseMesh);

      // Lower Body & Dancing Skirt (Sampot)
      const lowerBodyGeo = new THREE.CylinderGeometry(0.35, 0.48, 0.7, 24);
      const lowerMesh = new THREE.Mesh(lowerBodyGeo, sandstoneMat);
      lowerMesh.position.set(0.08, -0.3, 0);
      lowerMesh.rotation.z = 0.12;
      group.add(lowerMesh);

      // Slender Tribhanga Torso (Uon 3 khuc)
      const torsoGeo = new THREE.SphereGeometry(0.38, 24, 24);
      torsoGeo.scale(0.9, 1.3, 0.8);
      const torsoMesh = new THREE.Mesh(torsoGeo, sandstoneMat);
      torsoMesh.position.set(-0.06, 0.22, 0);
      torsoMesh.rotation.z = -0.15;
      group.add(torsoMesh);

      // Head & Serene Champa Face
      const headGeo = new THREE.SphereGeometry(0.22, 24, 24);
      const headMesh = new THREE.Mesh(headGeo, sandstoneMat);
      headMesh.position.set(0.02, 0.75, 0);
      group.add(headMesh);

      // Tiered Mukuta Crown (Vuong mien thap Cham)
      const crownGeo = new THREE.ConeGeometry(0.2, 0.55, 16);
      const crownMesh = new THREE.Mesh(crownGeo, goldMat);
      crownMesh.position.set(0.02, 1.1, 0);
      group.add(crownMesh);

      // Dancing Arms in Mudra Posture
      const leftArmGeo = new THREE.TorusGeometry(0.35, 0.06, 12, 24, Math.PI);
      const leftArm = new THREE.Mesh(leftArmGeo, sandstoneMat);
      leftArm.position.set(-0.35, 0.35, 0.1);
      leftArm.rotation.z = Math.PI / 4;
      group.add(leftArm);

      const rightArmGeo = new THREE.TorusGeometry(0.35, 0.06, 12, 24, Math.PI);
      const rightArm = new THREE.Mesh(rightArmGeo, sandstoneMat);
      rightArm.position.set(0.35, 0.35, 0.1);
      rightArm.rotation.z = -Math.PI / 4;
      group.add(rightArm);
      break;
    }
  }
}

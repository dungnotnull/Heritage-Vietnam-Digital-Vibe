import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
} from 'docx';
import { PlannerTripPlan, Language } from '../types';

export async function generateTripWordDocument(plan: PlannerTripPlan, language: Language = 'vi'): Promise<Blob> {
  const isVi = language === 'vi';

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch = 1440 dxa
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          // Header / Branding Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'HERITAGEVIBE • TINH HOA DI SẢN VIỆT NAM',
                bold: true,
                size: 20,
                color: 'B45309', // Amber 700
                font: 'Arial',
              }),
            ],
          }),

          // Main Document Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.TITLE,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: isVi ? plan.titleVi : plan.titleEn,
                bold: true,
                size: 36,
                color: '1C1917', // Stone 900
                font: 'Arial',
              }),
            ],
          }),

          // Subtitle
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 360 },
            children: [
              new TextRun({
                text: isVi ? plan.subtitleVi : plan.subtitleEn,
                italics: true,
                size: 24,
                color: '57534E', // Stone 600
                font: 'Arial',
              }),
            ],
          }),

          // Divider Bar Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 8, color: 'B45309' },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            rows: [new TableRow({ children: [new TableCell({ children: [] })] })],
          }),

          // Section 1: Trip Summary Overview
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 280, after: 160 },
            children: [
              new TextRun({
                text: isVi ? '1. TỔNG QUAN HÀNH TRÌNH' : '1. TRIP OVERVIEW',
                bold: true,
                size: 26,
                color: 'B45309',
                font: 'Arial',
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: isVi ? plan.overviewSummaryVi : plan.overviewSummaryEn,
                size: 22,
                font: 'Arial',
                color: '292524',
              }),
            ],
          }),

          // Key Parameters Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: 'FEF3C7' }, // Amber 100
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: isVi ? 'Thời điểm / Tháng:' : 'Travel Month:', bold: true, size: 20, font: 'Arial' })],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: `${isVi ? 'Tháng ' : 'Month '}${plan.requestParams.month} (${isVi ? plan.seasonHighlightsVi : plan.seasonHighlightsEn})`, size: 20, font: 'Arial' })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: 'FEF3C7' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: isVi ? 'Thời lượng:' : 'Duration:', bold: true, size: 20, font: 'Arial' })],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: `${plan.requestParams.durationDays} ${isVi ? 'Ngày' : 'Days'}`, size: 20, font: 'Arial' })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: 'FEF3C7' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: isVi ? 'Kinh phí dự toán:' : 'Estimated Budget:', bold: true, size: 20, font: 'Arial' })],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: isVi ? plan.estimatedBudgetVi : plan.estimatedBudgetEn, size: 20, font: 'Arial', bold: true, color: 'B45309' })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: 'FEF3C7' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: isVi ? 'Phương tiện di chuyển:' : 'Transport:', bold: true, size: 20, font: 'Arial' })],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: isVi ? plan.transportRecommendationVi : plan.transportRecommendationEn, size: 20, font: 'Arial' })],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Section 2: Detailed Day-by-Day Schedule with Clustered Spots
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 160 },
            children: [
              new TextRun({
                text: isVi ? '2. LỊCH TRÌNH CHI TIẾT THEO NGÀY (CỤM ĐỊA ĐIỂM THUẬN TIỆN)' : '2. DAY-BY-DAY ITINERARY (CLUSTERED ROUTES)',
                bold: true,
                size: 26,
                color: 'B45309',
                font: 'Arial',
              }),
            ],
          }),

          // Generate each day
          ...plan.days.flatMap((day) => [
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 240, after: 120 },
              children: [
                new TextRun({
                  text: `${isVi ? `NGÀY ${day.day}: ` : `DAY ${day.day}: `}${isVi ? day.titleVi : day.titleEn}`,
                  bold: true,
                  size: 24,
                  color: '92400E',
                  font: 'Arial',
                }),
              ],
            }),

            new Paragraph({
              spacing: { after: 160 },
              children: [
                new TextRun({
                  text: `${isVi ? 'Chủ đề: ' : 'Theme: '}${isVi ? day.themeVi : day.themeEn}`,
                  italics: true,
                  size: 20,
                  color: '78716C',
                  font: 'Arial',
                }),
              ],
            }),

            // Destinations in this day
            ...day.destinations.flatMap((dest, idx) => [
              new Paragraph({
                spacing: { before: 80, after: 60 },
                bullet: { level: 0 },
                children: [
                  new TextRun({
                    text: `[${dest.timeSlot}] `,
                    bold: true,
                    color: 'B45309',
                    size: 22,
                    font: 'Arial',
                  }),
                  new TextRun({
                    text: `${isVi ? dest.nameVi : dest.nameEn}`,
                    bold: true,
                    size: 22,
                    color: '1C1917',
                    font: 'Arial',
                  }),
                  dest.isNearbyClustered
                    ? new TextRun({
                        text: isVi ? ' (★ Cùng cụm di chuyển gần)' : ' (★ Clustered Route)',
                        color: '059669',
                        size: 20,
                        font: 'Arial',
                      })
                    : new TextRun({ text: '' }),
                ],
              }),
              new Paragraph({
                spacing: { after: 60 },
                indent: { left: 400 },
                children: [
                  new TextRun({
                    text: isVi ? dest.descriptionVi : dest.descriptionEn,
                    size: 20,
                    font: 'Arial',
                    color: '44403C',
                  }),
                ],
              }),
              new Paragraph({
                spacing: { after: 120 },
                indent: { left: 400 },
                children: [
                  new TextRun({
                    text: isVi ? 'Mẹo & Lưu ý: ' : 'Tips & Notes: ',
                    bold: true,
                    size: 19,
                    color: '92400E',
                    font: 'Arial',
                  }),
                  new TextRun({
                    text: isVi ? dest.travelTipsVi : dest.travelTipsEn,
                    italics: true,
                    size: 19,
                    color: '57534E',
                    font: 'Arial',
                  }),
                ],
              }),
            ]),

            // Meals of the day
            new Paragraph({
              spacing: { before: 80, after: 180 },
              children: [
                new TextRun({
                  text: isVi ? '🍽️ Ẩm thực đề xuất trong ngày: ' : '🍽️ Recommended Cuisine: ',
                  bold: true,
                  size: 20,
                  color: 'B45309',
                  font: 'Arial',
                }),
                new TextRun({
                  text: (isVi ? day.mealsVi : day.mealsEn).join(' • '),
                  size: 20,
                  font: 'Arial',
                  color: '292524',
                }),
              ],
            }),
          ]),

          // Section 3: Packing Checklist
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 160 },
            children: [
              new TextRun({
                text: isVi ? '3. DANH SÁCH VẬT DỤNG CẦN CHUẨN BỊ (PACKING CHECKLIST)' : '3. PACKING & PREPARATION CHECKLIST',
                bold: true,
                size: 26,
                color: 'B45309',
                font: 'Arial',
              }),
            ],
          }),

          ...(isVi ? plan.packingChecklistVi : plan.packingChecklistEn).map(
            (item) =>
              new Paragraph({
                spacing: { after: 80 },
                bullet: { level: 0 },
                children: [
                  new TextRun({
                    text: `[  ] ${item}`,
                    size: 20,
                    font: 'Arial',
                    color: '292524',
                  }),
                ],
              })
          ),

          // Section 4: Cultural Notes & Etiquette
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 160 },
            children: [
              new TextRun({
                text: isVi ? '4. LƯU Ý VĂN HÓA & KIẾN THỨC BỔ SUNG' : '4. CULTURAL ETIQUETTE & HERITAGE INSIGHTS',
                bold: true,
                size: 26,
                color: 'B45309',
                font: 'Arial',
              }),
            ],
          }),

          ...(isVi ? plan.culturalNotesVi : plan.culturalNotesEn).map(
            (note) =>
              new Paragraph({
                spacing: { after: 100 },
                bullet: { level: 0 },
                children: [
                  new TextRun({
                    text: note,
                    size: 20,
                    font: 'Arial',
                    color: '292524',
                  }),
                ],
              })
          ),

          // Section 5: Recommended Souvenirs
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 360, after: 160 },
            children: [
              new TextRun({
                text: isVi ? '5. ĐẶC SẢN & QUÀ LƯU NIỆM NÊN MUA' : '5. AUTHENTIC SOUVENIRS & ARTISAN CRAFTS',
                bold: true,
                size: 26,
                color: 'B45309',
                font: 'Arial',
              }),
            ],
          }),

          ...(isVi ? plan.recommendedSouvenirsVi : plan.recommendedSouvenirsEn).map(
            (souv) =>
              new Paragraph({
                spacing: { after: 80 },
                bullet: { level: 0 },
                children: [
                  new TextRun({
                    text: `🎁 ${souv}`,
                    size: 20,
                    font: 'Arial',
                    color: '292524',
                  }),
                ],
              })
          ),

          // Footer Notice
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 480 },
            children: [
              new TextRun({
                text: 'HeritageVibe — Nền tảng Bảo tồn & Lan tỏa Di sản Văn hóa Việt Nam (2026)',
                italics: true,
                size: 18,
                color: '78716C',
                font: 'Arial',
              }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportTripPlanToDocx(plan: PlannerTripPlan, language: Language = 'vi'): Promise<void> {
  const blob = await generateTripWordDocument(plan, language);
  const title = (language === 'vi' ? plan.titleVi : plan.titleEn) || 'Lich-Trinh-Di-San-HeritageVibe';
  const safeTitle = title
    .replace(/[^a-zA-Z0-9\u00C0-\u024F\u1EA0-\u1EF9]/g, '_')
    .substring(0, 40);
  const filename = `${safeTitle}.docx`;
  downloadBlob(blob, filename);
}

const { test, expect } = require('@playwright/test');
const url = 'http://127.0.0.1:4173';
test.beforeEach(async ({page})=>{await page.goto(url);await page.evaluate(()=>localStorage.clear());await page.reload()});
test('beginner home and project navigation', async ({page})=>{
 await expect(page.getByText('โปรเจกต์ของฉัน')).toBeVisible();
 await page.getByRole('button',{name:/เปิดงาน/}).first().click();
 await expect(page.getByRole('heading',{name:'จัดการฉาก'})).toBeVisible();
});
test('create scene, add dialogue, lock and generate prompt', async ({page})=>{
 await page.getByRole('button',{name:/เปิดงาน/}).first().click();
 await page.locator('#newScene [name=title]').fill('ฉากทดลอง');
 await page.locator('#newScene [name=location]').fill('บ้านอีสาน');
 await page.locator('#newScene button').click();
 await expect(page.getByText('ฉากทดลอง')).toBeVisible();
 await page.locator('[data-select-scene]').first().click();
 await page.locator('#newDialogue [name=speaker]').fill('บักดำ');
 await page.locator('#newDialogue [name=text]').fill('เว้าอีสานเด้อ');
 await page.locator('#newDialogue button').click();
 await page.getByRole('button',{name:'ล็อกบทพูด'}).click();
 await expect(page.getByText('🔒 LOCKED')).toBeVisible();
 await expect(page.locator('[data-edit-dialogue]')).toHaveCount(0);
 await page.getByRole('button',{name:'Prompt สำหรับ FLOW'}).first().click();
 await page.locator('#generate').click();
 await expect(page.locator('#output')).toContainText('เว้าอีสานเด้อ');
});
test('export backup',async ({page})=>{
 await page.getByRole('button',{name:'สำรองข้อมูล'}).first().click();
 const downloadPromise=page.waitForEvent('download');
 await page.locator('#export').click();
 const download=await downloadPromise;
 expect(download.suggestedFilename()).toBe('isan-film-studio-backup.json');
});

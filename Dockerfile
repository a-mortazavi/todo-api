# استفاده از Node.js نسخه 18
FROM node:18

# ایجاد پوشه کاری داخل کانتینر
WORKDIR /usr/src/app

# کپی package.json و نصب پکیج‌ها
COPY package*.json ./
RUN npm install

# کپی کردن کل پروژه به داخل کانتینر
COPY . .

# فرمان پیش‌فرض برای اجرای اپلیکیشن
CMD ["node", "index.js"]

# باز کردن پورت 8000
EXPOSE 8000

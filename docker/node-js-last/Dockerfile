# Используем последнюю версию Node.js
FROM node:latest

# Устанавливаем рабочую директорию в контейнере в /var/www/tanukicode-ui
WORKDIR /var/www/tanukicode-ui

# Копируем файл package.json в рабочую директорию
COPY ./public/package.json /var/www/tanukicode-ui/

# Устанавливаем зависимости
RUN npm install

# Копируем весь контент из папки public в рабочую директорию
COPY ./public /var/www/tanukicode-ui/

# Открываем порты
EXPOSE 9003

# Устанавливаем команду для запуска приложения
CMD ["npm", "start"]

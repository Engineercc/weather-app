# weather-app

## How to Run ? 
1. First you should take api key on openweathermap API
2. Create .env file in project folder.
3. add this code inside of .env file : REACT_APP_WEATHER_API_KEY= your_api_key
4. Finally Run the npm install & npm start

### Proje Hakkında

1. Selamlar. Case ile ilgili bir kaç cümle kurduktan sonra neler yaptığımdan ve projenin ayrıntılarından bahsedeceğim.
2. Öncelikle case için teşekkür ederim. Daha önce free API'ler ile çalışmıştım ama openWeatherAPI ile gelen verilerin yapısı biraz karmaşık olduğu için beni biraz daha zorladı.
Ama çok iyi oldu benim açımdan.
3. Projeyi olabildiğince yetiştirmeye çalıştım. Süre aslında yeterliydi fakat tam zamanlı olarak çalıştığım için, proje geliştirme zamanım biraz kısıtlıydı.
Bu nedenle case'i zamanında bitirmek için uğraştım. 
4. Kodların tek sayfada ve karışık olduğu ile ilgili bir geri dönüş olabilir(kendim de değerlendirecek olsam derdim). Bunun nedeni projeyi yetiştirmeye çalışmam.
5. Projeyi componentlere bölüp, contextAPI ya da redux toolkit ile destekleseydim, arama yaparken farklı senaryoları kontrol edip,
hataları minimuma indirseydim çok daha iyi modüler bir proje ortaya çıkabilirdi. 
6. Beni değerli görüp case değerlendirmesini gönderdiğiniz için teşekkür ederim.

### Proje Detayları

1. Projede 2 farklı get isteği attım. birisi anlık hava durumu için, diğeri de 5 günlük hava durumu için( aslında 5 günlük hava durumu için attığım isteğin
içinden günlük veriyi de çekebilirdim. Bunu deneyeceğim).
2. APIKey aldığımda aktif hale gelmesi biraz sürdü. Siz de key vardır belki ama ben yine de uğraşılmasın diye .env dosyasını ignore içine koymadım. Direk proje çalışsın diye.
3. Search kısmında hiçbişey girmeden istek atamıyor. Uyarı veriyor. Şehir aradığında anlık veriyi getiriyor. Aynı zamanda hava durumuna göre arkaplanı değiştiriyor.
Hava karlıysa backgroundda kar ile ilgili fotoğraf, yağmurluysa yağmurlu olduğu ile ilgili bir fotoğraf geliyor vs.
4. 5 günlük hava tahminlerini tab yapısı şeklinde yaptım. Günleri de yine api'den gelen dt değerini kullanıp, günler dizisi tanımlayıp onunla eşleştirerek ekledim.
5. API'den Array içerisinde 40 tane obje değeri geliyordu. ben bunları Arrayin içerisinde tekrar 5 elemanlı array oluşturup, 8'er tane eleman bir array içerisinde olacak
şekilde böldüm(pagination mantığı gibi).
6. Favori şehirler ReactRouter ile  yönlendirme yapıyor. 
7. Bu kısımda kullanıcı yine arama yapıyor. Favori listeye ekleme yapabiliyor. Çıkarma işlemini de cart içerisindeki kalp işaretine tıklayarak yapabiliyor.
8. Faovri şehirleri getirirken arkaplan olarak default fotoğraf koydum. Google'ın şehirler ve fotoğraf ile ilgili API'si varmış(autocomplete, şehir fotoğrafı getirme vs.)
ama ona bakamadım.
9. Sağ üstteki favori şehirler kısmıda dinamik olarak favori şehirler dizisinin uzunluğunu alıyor.
10. Projedeki işlemleri react-toastify kullanarak alertlerle desteklemeye çalıştım.

### live version: https://open-weather-case.netlify.app

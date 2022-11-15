200 OK A successful GET or PUT request
201 Created A successful POST request
204 No content A successful DELETE request
400 Bad request An unsuccessful GET, POST, or PUT request, due to invalid content
401 Unauthorized Requesting a restricted URL with incorrect credentials
403 Forbidden Making a request that isn’t allowed
404 Not found Unsuccessful request due to an incorrect parameter in the URL
405 Method not allowed Request method not allowed for the given URL

example using API

http://localhost:3000/api/values?point=3&time_stamp[$lte]=2021-12-08

http://localhost:3000/api/values?point=3&time_stamp[$lt]=2021-12-08

http://127.0.0.1:3000/api/db-points/3?include=options

http://localhost:3000/api/db-points/1/value?time_stamp=2021-12-09T07:00:00.000Z

http://localhost:3000/api/db-points/1/changes?time_stamp=2021-12-09T07:00:00.000Z

http://localhost:3000/api/db-points/1/calc?time_stamp=2021-12-09T07:00:00.000Z  - calculated value

http://localhost:3000/api/values/table/stats?time_stamp=2021-12-01T07:00&points=[1,2,3]&begin=2021-12-01T07:00&end=2021-12-31T07:00

http://localhost:3000/api/values/table?time_stamp=2021-12-01T07:00&points=[1,2,3]&begin=2021-12-01T07:00&end=2021-12-31T07:00


вызов отчета соглашения
begin - начало запроса
end -конец запроса (не включается)
step -шаг запроса точек (мин)
length - количество шагов

step - опционально
end и length  взаимоисключающие (одно обязательно)


EXCEL соглашения

1 Тип ячейки number 
1.1 int точка БД, стиль отображения input, пример 10- точка БД, стиль отображения input, пример 10


2 Тип ячейки string
2.1 пример "234.1",  точка БД 234, номер функции 1 (функция применяется к точке, например, прошлый день, сумма с начала месяца)

2.2 "23" int number - точка БД 23, для чтения  стиль отображения text, пример '10

2.3 начало с @ '@1' значение функции 1, стиль отображения text
2.4 начало с $ '$34.2' произвольный запрос 34 точка 2, стиль отображения text
2.5 начало с # '#2' значение ключа (_id), номер функции 2 ( применяется к ключу format hh:mm) стиль отображения text
2.6 иначе  - стиль отображения text, пример 'Название параметра ....' (идет напрямую без преобразования) 

FROM python:3.7.3-alpine3.8

ADD . /app

WORKDIR /app

RUN pip install -r requirements.txt

EXPOSE 80

CMD ["python", "app.py"]
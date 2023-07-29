FROM python:3.8.17

ENV PYTHONUNBUFFERED 1

WORKDIR /tmp

RUN pip install --upgrade pip

COPY ./requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . /code
WORKDIR /code
COPY entrypoint.local.sh /entrypoint.local.sh

RUN chmod +x /entrypoint.local.sh

ENTRYPOINT [ "/entrypoint.local.sh" ]

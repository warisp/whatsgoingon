# Dockerfile-flask

FROM python:3.8

ADD whatsgoingon project
WORKDIR project

RUN pip install -r requirements.txt

CMD ["python", "run.py"]

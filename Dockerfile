# Dockerfile-flask

FROM python:3.12

ADD whatsgoingon project
ADD requirements.txt project
WORKDIR project

RUN pip install -r requirements.txt

CMD ["python", "run.py"]

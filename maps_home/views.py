from django.shortcuts import render
from django.http import HttpResponse
from bs4 import BeautifulSoup
import requests 




# Create your views here.
def index(request):
    page = requests.get("https://api.coronatracker.com/v3/stats/worldometer/topCountry")
    soup = BeautifulSoup(page.content , "html.parser")

    literal_text = f"let statistics = {soup}"

    info_file = open("maps_home/static/js/info.js" , "w")
    info_file.write(literal_text)
    info_file.close()

    return render(request , "index.html")
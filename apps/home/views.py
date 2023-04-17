
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.views import View


class LoginRequireView(View):

    def dispatch(self, request, *args, **kwargs):
        if request.method == 'GET':
            if not request.user.is_authenticated:
                return redirect("login")
            return self.get(request, *args, **kwargs)
        return super().dispatch(request, *args, **kwargs)


class Index(LoginRequireView):

    def get(self, request, *args, **kwargs):
        return render(request, "home/index.html")


class SwipeCard(LoginRequireView):

    def get(self, request, *args, **kwargs):
        context = {
            "sidebar": "swipecard",
            "pagename": "Quẹt thẻ",
        }
        return render(request, "home/swipe_card.html", context)
    
    def post(self, request, *args, **kwargs):
        print(request.POST)
        context = {
            "sidebar": "swipecard"
        }
        # return HttpResponseRedirect('swipe_card')
        return render(request, "home/swipe_card.html", context)


class Test(LoginRequireView):

    def get(self, request, *args, **kwargs):
        context = {
            "sidebar": "swipecard"
        }
        return render(request, "home/test.html", context)


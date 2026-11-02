using Microsoft.AspNetCore.Mvc;

namespace KiranChamlingRaiWebsite.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }

        public IActionResult Biography()
        {
            return View();
        }

        public IActionResult TheatreWorks()
        {
            return View();
        }

        // 👇 नयाँ थपिएको (तपाईंको Layout ले यही खोज्छ)
        public IActionResult Films()
        {
            return View(); 
        }

        // तपाईंको पुरानो पनि रहन दिएको (यदि कतै यसलाई प्रयोग गरिएको छ भने)
        public IActionResult FilmDirection()
        {
            return View();
        }

        public IActionResult Videos()
        {
            return View();
        }

        public IActionResult News()
        {
            return View();
        }

        public IActionResult PlayDetails(string id)
        {
            ViewBag.PlayId = id;
            return View();
        }

        public IActionResult FilmDetails(string id)
        {
            ViewBag.FilmId = id;
            return View(); 
        }

        // 👇 डबल [HttpGet] हटाइयो
        [HttpGet]
        public IActionResult Contact()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Contact(string name, string email, string message)
        {
            TempData["ContactMessage"] = "Thank you! Your message has been sent.";
            return RedirectToAction("Contact");
        }
    }
}
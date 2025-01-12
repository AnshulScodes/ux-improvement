from playwright.sync_api import sync_playwright
import time

class WebsiteCrawler:
    def __init__(self):
        self.data = {
            'title': '',
            'links': [],
            'buttons': [],
            'forms': [],
            'navigation': [],
            'images': [],
            'text_content': [],
            'interactive_elements': []
        }

    def crawl(self, url):
        with sync_playwright() as p:
            # Launch browser
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            
            try:
                # Go to URL
                page.goto(url, wait_until='networkidle')
                time.sleep(2)  # Give dynamic content time to load
                
                # Get page title
                self.data['title'] = page.title()
                
                # Get all links
                links = page.query_selector_all('a')
                self.data['links'] = [
                    {
                        'text': link.inner_text(),
                        'href': link.get_attribute('href'),
                        'location': self._get_element_location(link)
                    }
                    for link in links
                ]
                
                # Get all buttons
                buttons = page.query_selector_all('button')
                self.data['buttons'] = [
                    {
                        'text': button.inner_text(),
                        'location': self._get_element_location(button)
                    }
                    for button in buttons
                ]
                
                # Get navigation elements
                nav_elements = page.query_selector_all('nav, header')
                self.data['navigation'] = [
                    {
                        'text': nav.inner_text(),
                        'location': self._get_element_location(nav)
                    }
                    for nav in nav_elements
                ]
                
                # Get forms
                forms = page.query_selector_all('form')
                self.data['forms'] = [
                    {
                        'inputs': len(form.query_selector_all('input')),
                        'location': self._get_element_location(form)
                    }
                    for form in forms
                ]
                
                # Get images
                images = page.query_selector_all('img')
                self.data['images'] = [
                    {
                        'alt': img.get_attribute('alt'),
                        'src': img.get_attribute('src'),
                        'location': self._get_element_location(img)
                    }
                    for img in images
                ]
                
                # Get interactive elements
                interactive = page.query_selector_all('[onclick], [onmouseover], [onmouseout]')
                self.data['interactive_elements'] = [
                    {
                        'type': elem.tag_name(),
                        'location': self._get_element_location(elem)
                    }
                    for elem in interactive
                ]
                
                return self.data
                
            except Exception as e:
                return {'error': str(e)}
            
            finally:
                browser.close()
    
    def _get_element_location(self, element):
        try:
            bbox = element.bounding_box()
            return {
                'x': bbox['x'],
                'y': bbox['y'],
                'width': bbox['width'],
                'height': bbox['height']
            }
        except:
            return None
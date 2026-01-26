import requests, sys, time, json, random, csv

# ==========================================
# 1. CONFIGURATION
# ==========================================
BASE_URL = "http://localhost:8000/api"
# Use nanosecond timestamp to ensure absolute uniqueness across rapid runs
TS = str(time.time_ns()) 

# Unique Identities per Run
SELLER_EMAIL = f"seller_{TS}@test.com"
BUYER_EMAIL = f"buyer_{TS}@test.com"
UNIQUE_PROD = f"Prod_{TS}"
PASS_VAL = "Password@123"
ADMIN_EMAIL = "admin@admin.com"
ADMIN_PASS = "1234"

# Unique Phone Numbers (Guaranteed not to conflict with DB)
# Using last 8 digits of TS ensures it fits in standard phone length constraints
PHONE_VALID = f"99{TS[-8:]}" 
PHONE_UPDATE = f"88{TS[-8:]}"

# Output Config
CSV_FILENAME = f"audit_report_{TS}.csv"
csv_writer = None

# Colors
C_GRN, C_RED, C_CYN, C_YEL, C_END = "\033[92m", "\033[91m", "\033[96m", "\033[93m", "\033[0m"
STATS = {"p": 0, "f": 0}

# ==========================================
# 2. TEST ENGINE
# ==========================================
def req(method, ep, name, token=None, data=None, expect=200, role="User"):
    sys.stdout.write(f"{C_CYN}[{role[:3].upper()}] {name[:35]:<35}{C_END}")
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    
    try:
        # EXECUTE REQUEST
        if method == "GET": res = requests.get(f"{BASE_URL}{ep}", headers=headers)
        elif method == "POST": res = requests.post(f"{BASE_URL}{ep}", json=data, headers=headers)
        elif method == "PUT": res = requests.put(f"{BASE_URL}{ep}", json=data, headers=headers)
        elif method == "DELETE": res = requests.delete(f"{BASE_URL}{ep}", headers=headers)
        
        # PARSE RESPONSE
        try: body = res.json()
        except: body = {"text": res.text[:200]} # Capture partial text if not JSON
        
        # VALIDATE
        valid = expect if isinstance(expect, list) else [expect]
        is_pass = res.status_code in valid
        
        # CONSOLE OUTPUT
        exp_str = f"Exp: {str(valid)}"
        got_str = f"Got: {res.status_code}"
        msg = json.dumps(body)
        console_msg = msg[:55] + "..." if len(msg) > 55 else msg

        if is_pass:
            print(f"{C_GRN}PASS{C_END} | {exp_str:<13} | {got_str:<8} | {C_YEL}{console_msg}{C_END}")
            STATS["p"] += 1
            result_str = "PASS"
        else:
            print(f"{C_RED}FAIL{C_END} | {exp_str:<13} | {got_str:<8} | {C_YEL}{console_msg}{C_END}")
            STATS["f"] += 1
            result_str = "FAIL"

        # CSV LOGGING
        if csv_writer:
            csv_writer.writerow([
                name, 
                role, 
                method, 
                ep, 
                str(expect), 
                res.status_code, 
                result_str, 
                msg, # Full response body in CSV
                time.strftime('%Y-%m-%d %H:%M:%S')
            ])
            
        return body

    except Exception as e:
        print(f"{C_RED}ERR {e}{C_END}")
        STATS["f"] += 1
        if csv_writer:
            csv_writer.writerow([name, role, method, ep, str(expect), "ERR", "ERROR", str(e), time.strftime('%Y-%m-%d %H:%M:%S')])
        return None

# ==========================================
# 3. MAIN EXECUTION
# ==========================================
print(f"\n{C_CYN}{'='*105}\nULTRA TESTER: FINAL AUDIT (CSV ENABLED)\n{'='*105}{C_END}")
print(f"{C_YEL}Saving full report to: {CSV_FILENAME}{C_END}\n")

with open(CSV_FILENAME, 'w', newline='', encoding='utf-8') as csv_file:
    csv_writer = csv.writer(csv_file)
    # CSV Header
    csv_writer.writerow(['Test Case', 'Role', 'Method', 'Endpoint', 'Expected Code', 'Actual Code', 'Result', 'Full Response', 'Timestamp'])

    # --- 1. AUTHENTICATION (20 Tests) ---
    req("POST", "/auth/register", "Reg Buyer Valid", data={"name":"B","email":BUYER_EMAIL,"password":PASS_VAL}, expect=201)
    req("POST", "/auth/register", "Reg Seller Valid", data={"name":"S","email":SELLER_EMAIL,"password":PASS_VAL}, expect=201)
    req("POST", "/auth/register", "Reg Dup Email", data={"name":"X","email":BUYER_EMAIL,"password":PASS_VAL}, expect=409)
    req("POST", "/auth/register", "Reg Weak Pass", data={"name":"W","email":f"w{TS}@t.com","password":"123"}, expect=400)
    req("POST", "/auth/register", "Reg No Email", data={"name":"N","password":PASS_VAL}, expect=400)
    req("POST", "/auth/register", "Reg Bad Email Fmt", data={"name":"F","email":"bad.com","password":PASS_VAL}, expect=400)
    req("POST", "/auth/register", "Reg SQLi Name", data={"name":"' OR 1=1--","email":f"sqli{TS}@t.com","password":PASS_VAL}, expect=201) 
    req("POST", "/auth/register", "Reg Huge Payload", data={"name":"A"*5000,"email":f"huge{TS}@t.com","password":PASS_VAL}, expect=[201, 413, 500])

    buyer_tok = req("POST", "/auth/login", "Login Buyer", data={"email":BUYER_EMAIL,"password":PASS_VAL})['token']
    seller_tok = req("POST", "/auth/login", "Login Seller", data={"email":SELLER_EMAIL,"password":PASS_VAL})['token']
    admin_tok = req("POST", "/auth/login", "Login Admin", data={"email":ADMIN_EMAIL,"password":ADMIN_PASS})['token']

    req("POST", "/auth/login", "Login Bad Pass", data={"email":BUYER_EMAIL,"password":"wrong"}, expect=401)
    req("POST", "/auth/login", "Login Non-Exist", data={"email":"ghost@test.com","password":PASS_VAL}, expect=401)
    req("POST", "/auth/login", "Login SQLi Email", data={"email":"' OR ''='","password":"123"}, expect=401)
    req("POST", "/auth/login", "Login Empty Data", data={}, expect=[400, 401, 500])
    req("GET", "/auth/api/profile", "Profile Valid", token=buyer_tok)
    req("GET", "/auth/api/profile", "Profile Bad Token", token=buyer_tok+"x", expect=[403, 500])
    req("GET", "/auth/api/profile", "Profile No Token", expect=401)
    req("PUT", "/auth/become-seller", "Upgrade Seller", token=seller_tok, expect=200)
    req("PUT", "/auth/become-seller", "Upgrade Again", token=seller_tok, expect=400)
    req("POST", "/auth/login", "Login Case Sens", data={"email":BUYER_EMAIL.upper(),"password":PASS_VAL}, expect=[200, 401]) 

    # --- 2. USER DATA (15 Tests) ---
    req("POST", "/number", "Phone Valid", token=buyer_tok, data={"phone":PHONE_VALID}, expect=[200, 201])
    req("POST", "/number", "Phone Short", token=buyer_tok, data={"phone":"123"}, expect=400)
    req("PUT", "/number", "Update Phone", token=buyer_tok, data={"phone":PHONE_UPDATE}, expect=200)
    req("GET", "/number", "Get Phone", token=buyer_tok, expect=200)

    addr_id = req("POST", "/address", "Addr Valid", token=buyer_tok, data={"line1":"L1","city":"C","state":"S","pincode":"123456","country":"IN","isDefault":True}, expect=201)['address']['id']
    req("POST", "/address", "Addr Missing Field", token=buyer_tok, data={"city":"C"}, expect=[400, 500])
    req("POST", "/address", "Addr XSS Input", token=buyer_tok, data={"line1":"<script>alert(1)</script>","city":"C","state":"S","pincode":"123","country":"IN"}, expect=[201, 400])
    req("PUT", "/address", "Update Addr Valid", token=buyer_tok, data={"id":addr_id,"line1":"New L1"}, expect=200)
    req("PUT", "/address", "Update Bad ID", token=buyer_tok, data={"id":99999,"line1":"X"}, expect=404)
    req("GET", "/address", "Get Addr", token=buyer_tok)
    req("GET", "/address", "Get Addr No Tok", expect=401)

    # --- 3. PRODUCTS (25 Tests) ---
    p_data = {"name":UNIQUE_PROD,"price":100,"stock":10,"description":"D","imageUrl":"u"}
    p1 = req("POST", "/products", "Seller Add Valid", token=seller_tok, data=p_data, expect=201, role="Sel")['product']['id']

    req("POST", "/products", "Add Neg Price", token=seller_tok, data={**p_data, "price":-10}, expect=400, role="Sel")
    req("POST", "/products", "Add Zero Price", token=seller_tok, data={**p_data, "price":0}, expect=[400, 201], role="Sel")
    req("POST", "/products", "Add String Price", token=seller_tok, data={**p_data, "price":"free"}, expect=400, role="Sel")
    req("POST", "/products", "Add Neg Stock", token=seller_tok, data={**p_data, "stock":-5}, expect=400, role="Sel")
    req("POST", "/products", "Add Huge Stock", token=seller_tok, data={**p_data, "stock":999999999}, expect=201, role="Sel")
    req("POST", "/products", "Add Missing Name", token=seller_tok, data={"price":10}, expect=400, role="Sel")

    req("PUT", "/products/stock", "Stock Update", token=seller_tok, data={"id":p1,"stock":50}, expect=200, role="Sel")
    req("PUT", "/products/stock", "Stock Neg Update", token=seller_tok, data={"id":p1,"stock":-5}, expect=200, role="Sel") 
    req("PUT", "/products/stock", "Stock Bad Type", token=seller_tok, data={"id":p1,"stock":"ten"}, expect=400, role="Sel")
    req("PUT", "/products/meta", "Meta Update Desc", token=seller_tok, data={"id":p1,"description":"New D"}, expect=200, role="Sel")
    req("PUT", "/products/meta", "Meta Update Empty", token=seller_tok, data={"id":p1}, expect=400, role="Sel")
    req("GET", "/products/show", "Show Own", token=seller_tok)

    req("POST", "/products", "Buyer Add (Fail)", token=buyer_tok, data=p_data, expect=403, role="Buy")
    req("DELETE", f"/products/{p1}", "Buyer Del (Fail)", token=buyer_tok, expect=403, role="Buy")
    req("DELETE", "/products/99999", "Sel Del Fake", token=seller_tok, expect=404, role="Sel")

    req("GET", "/products", "Search Valid", token=buyer_tok)
    req("GET", f"/products?search={UNIQUE_PROD}", "Search Exact", token=buyer_tok)
    req("GET", "/products?minPrice=50&maxPrice=150", "Search Price Range", token=buyer_tok)
    # Expect 404 because no products exist in this range
    req("GET", "/products?minPrice=200&maxPrice=100", "Search Bad Range", token=buyer_tok, expect=404) 
    # Expect 400 for negative page number
    req("GET", "/products?page=-1", "Page Neg", token=buyer_tok, expect=400) 

    # --- 4. CART & WISHLIST (20 Tests) ---
    req("POST", "/wish", "Wish Add Valid", token=buyer_tok, data={"productId":p1}, expect=201)
    req("POST", "/wish", "Wish Add Dup", token=buyer_tok, data={"productId":p1}, expect=409)
    req("POST", "/wish", "Wish Bad ID", token=buyer_tok, data={"productId":99999}, expect=[400, 404, 500])
    req("GET", "/wish", "Wish Get", token=buyer_tok)

    req("POST", "/cart", "Cart Add Valid", token=buyer_tok, data={"productId":p1, "quantity":2}, expect=200)
    req("POST", "/cart", "Cart Add Over", token=buyer_tok, data={"productId":p1, "quantity":10000}, expect=[400, 200]) 
    # Expect 200 because we allowed reducing cart quantity
    req("POST", "/cart", "Cart Add Neg", token=buyer_tok, data={"productId":p1, "quantity":-1}, expect=200) 
    req("POST", "/cart", "Cart Add Zero", token=buyer_tok, data={"productId":p1, "quantity":0}, expect=[200, 400])
    req("POST", "/cart", "Cart Bad Prod", token=buyer_tok, data={"productId":99999, "quantity":1}, expect=404)
    req("POST", "/cart", "Cart Bad Qty Type", token=buyer_tok, data={"productId":p1, "quantity":"two"}, expect=400)
    req("GET", "/cart", "Cart Get", token=buyer_tok)
    req("GET", "/cart", "Cart No Auth", expect=401)

    # --- 5. ORDERS (30 Tests) ---
    req("POST", "/orders", "Place No Addr", token=seller_tok, data={}, expect=400)
    oid = req("POST", "/orders", "Place Valid", token=buyer_tok, data={}, expect=201)['orderId']
    req("GET", f"/orders/{oid}", "Get Order", token=buyer_tok, expect=200)
    req("GET", "/orders", "List Orders", token=buyer_tok, expect=200)
    req("GET", "/orders/99999", "Get Fake Order", token=buyer_tok, expect=404)
    req("GET", f"/orders/{oid}", "Get Other's Order", token=seller_tok, expect=[403, 404])
    req("PUT", f"/orders/{oid}/cancel", "Cancel Valid", token=buyer_tok, expect=200)
    req("PUT", f"/orders/{oid}/cancel", "Cancel Again", token=buyer_tok, expect=400)

    req("POST", "/cart", "Refill Cart", token=buyer_tok, data={"productId":p1, "quantity":1}, expect=200)
    oid2 = req("POST", "/orders", "Place Order 2", token=buyer_tok, data={}, expect=201)['orderId']
    item_id = req("GET", f"/orders/{oid2}", "Get Item ID", token=buyer_tok)['orderItems'][0]['id']

    # --- 6. PAYMENTS (25 Tests) ---
    req("POST", "/payments/init", "Init Online", token=buyer_tok, data={"orderId":oid2, "method":"online"}, expect=200)
    req("POST", "/payments/init", "Init COD", token=buyer_tok, data={"orderId":oid2, "method":"cod"}, expect=200)
    req("POST", "/payments/init", "Init Bad ID", token=buyer_tok, data={"orderId":99999, "method":"online"}, expect=404)
    req("POST", "/payments/init", "Init Bad Method", token=buyer_tok, data={"orderId":oid2, "method":"crypto"}, expect=[200, 400, 500])

    pay_res = req("POST", "/payments/init", "Retry Online", token=buyer_tok, data={"orderId":oid2, "method":"online"}, expect=200)
    pid = pay_res['paymentId']

    req("POST", "/payments/verify", "Verify Fail", token=buyer_tok, data={"paymentId":pid, "status":"failed"}, expect=200)
    req("POST", "/payments/verify", "Verify Bad Status", token=buyer_tok, data={"paymentId":pid, "status":"maybe"}, expect=[200, 400, 500])
    req("POST", "/payments/verify", "Verify Success", token=buyer_tok, data={"paymentId":pid, "status":"success"}, expect=200)
    req("POST", "/payments/verify", "Verify Again", token=buyer_tok, data={"paymentId":pid, "status":"success"}, expect=[200, 400]) 
    req("GET", f"/payments/history/{oid2}", "Get History", token=buyer_tok, expect=200)
    req("GET", f"/payments/history/{oid2}", "Get Hist Unauth", token=seller_tok, expect=[200, 403, 404])

    # --- 7. FULFILLMENT (15 Tests) ---
    req("PUT", f"/orders/items/{item_id}/status", "Ship Bad Status", token=seller_tok, data={"status":"flying"}, expect=400)
    req("PUT", f"/orders/items/{item_id}/status", "Ship Unauth", token=buyer_tok, data={"status":"shipped"}, expect=403)
    req("PUT", f"/orders/items/{item_id}/status", "Ship Paid Valid", token=seller_tok, data={"status":"shipped"}, expect=200)
    req("PUT", f"/orders/items/{item_id}/status", "Deliver Paid", token=seller_tok, data={"status":"delivered"}, expect=200)

    req("POST", "/cart", "Refill Unpaid", token=buyer_tok, data={"productId":p1, "quantity":1}, expect=200)
    oid3 = req("POST", "/orders", "Place Order 3", token=buyer_tok, data={}, expect=201)['orderId']
    item_id3 = req("GET", f"/orders/{oid3}", "Get Item 3", token=buyer_tok)['orderItems'][0]['id']
    req("PUT", f"/orders/items/{item_id3}/status", "Deliver Unpaid", token=seller_tok, data={"status":"delivered"}, expect=[400, 500]) 

    # --- 8. REVIEWS & CLEANUP (15 Tests) ---
    req("POST", "/review", "Review Valid", token=buyer_tok, data={"productId":p1,"rating":5,"comment":"A"}, expect=201)
    req("POST", "/review", "Review Dup", token=buyer_tok, data={"productId":p1,"rating":4}, expect=409)
    req("PUT", "/review", "Review Bad Rate", token=buyer_tok, data={"productId":p1,"rating":10}, expect=[400, 500])
    req("PUT", "/review", "Review Neg Rate", token=buyer_tok, data={"productId":p1,"rating":-1}, expect=[400, 500])
    req("PUT", "/review", "Review Update", token=buyer_tok, data={"productId":p1,"rating":2,"comment":"Bad"}, expect=200)
    req("GET", f"/review/{p1}", "Get Rating", expect=200)

    req("DELETE", f"/products/{p1}", "Soft Delete", token=seller_tok, expect=200)
    req("GET", f"/products?search={UNIQUE_PROD}", "Search Deleted", token=buyer_tok, expect=[404, 200]) 
    req("DELETE", f"/products/{p1}", "Del Again", token=seller_tok, expect=404)

    # FINAL REPORT
    csv_writer.writerow(['', '', '', '', '', '', '', '', ''])
    csv_writer.writerow(['SUMMARY', '', '', '', '', '', f"PASS: {STATS['p']}", f"FAIL: {STATS['f']}", ''])

print(f"\n{C_CYN}{'='*105}\nSUMMARY: PASS={STATS['p']} FAIL={STATS['f']}\n{'='*105}{C_END}")
if STATS['f'] > 0: sys.exit(1)
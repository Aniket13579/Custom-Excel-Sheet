from django.http import HttpResponse
from django.shortcuts import render
import json
import timeit

names=['Aniket','Chaudhary','Khushi','Kansara','Yash','Sawant','Hello']
def home(request):
	rows=30
	cols=18
	ran=list(range(1,rows+1))
	print(type(ran))
	return render(request,"home.html",{"rows":rows,"cols":cols,"range":ran})

final_sort=[];dic_sort={}
def sorting(request):
	global final_sort,dic_sort
	final_sort=[];dic_sort={}
	ch=request.GET.get("choice")
	array=json.loads(request.GET.get("array"));
	print(array)
	
	for i in array:
		sp=i.split(":")
		print("sp",sp[0],sp[1])
		dic_sort[sp[0]]=sp[1]
	print("dic: ",dic_sort)

	for i,j in dic_sort.items():
		r=j.split(",")
		dic_sort[i]=r
		if(r[0].isalpha()):
			final_sort.append(r[0])
		else:
			final_sort.append(int(r[0]))
	print("final sort",final_sort)
	start_time=timeit.default_timer() 
	print(start_time)
	if(ch=="quick"):
		final_sort=quick_sort(0,len(final_sort)-1,final_sort)
		end_time=timeit.default_timer()
	else:
		final_sort=select_sort(final_sort)
		end_time=timeit.default_timer()

	total_time="%.8f"%(end_time-start_time)
	
	new_sort = newsort(final_sort,dic_sort)
	new_sort['timer']=total_time
	print(total_time)
	print("after sorting: ",final_sort) 
	print(new_sort); final_sort=[]; dic_sort={}
	return HttpResponse(json.dumps(new_sort))

def newsort(final_sort,dic_sort):
	k=0 # final_sort keys traversal counter
	keys=list(dic_sort.keys())
	
	new_sort={}
	for _ in range(len(dic_sort)):
		for i,j in dic_sort.items(): #final_sort =[1,2,3]  
			if k<len(final_sort) and str(final_sort[k])==j[0]: #  {"C1":[3,av],"C2":[1,pp]} 
				new_sort[keys[k]]=j[1:-1]  
				k+=1
	return new_sort

def partition_quick(start,end,array):
	pivotIndex=start
	pivot=array[pivotIndex]
	while start<end:
		while start<len(array) and array[start]<=pivot:
			start+=1
		while array[end]>pivot:
			end-=1
		if(start<end):
			temp=array[start]
			array[start]=array[end]
			array[end]=temp
	
	array[end],array[pivotIndex]=array[pivotIndex],array[end]
	return end

def quick_sort(start,end,array):
	if(start<end):
		p=partition_quick(start,end,array)
		quick_sort(start,p-1,array)
		quick_sort(p+1,end,array)
	
	return array		

def select_sort(array):
	for i in range(len(array)):
		minIndex=i;
		for j in range(i+1,len(array)):
			if array[minIndex]>array[j]:
				minIndex=j
			
		temp=array[i]
		array[i]=array[minIndex]
		array[minIndex]=temp
	print(array)
	return array		

def search(request): 
	choice=request.GET.get("choice")
	array_s=json.loads(request.GET.get("array_s"))
	searchelement=request.GET.get("val_s")
	start_time=timeit.default_timer()
	if(choice=="Linear"):
		pos=linear_search(array_s,searchelement)
		end_time=timeit.default_timer()
	else:
		pos=binary_search(array_s,searchelement)
		end_time=timeit.default_timer()
	total_time="%.8f"%(end_time-start_time)
	context={'pos':pos,'timer':total_time}
	return HttpResponse(json.dumps(context))

def linear_search(dic_s,val):
	for i,j in dic_s.items():
		for k in j:
			if (k==val):
				return i+str(j.index(val)+1)
	return "Element not found!" 
	
def binary_search(dic_s,val):
	for i,j in dic_s.items():
		j=bubbleSort(j)
		pos = binary_s(0,len(j),val,j)
		if(pos!=-1):
			return i+str(pos+1)
	return "Element not found!" 

def bubbleSort(ls):
	for i in range(len(ls)-1):
		for j in range(len(ls)-i-1):
			if(ls[j]>ls[j+1]):
				temp=ls[j+1]
				ls[j+1]=ls[j]
				ls[j]=temp
	print(ls)
	return ls

def binary_s(l,r,val,j):
	try:
		if(r>=l):
			mid=l+(r-l)//2 
			if(j[mid]==val):
				return mid
			elif val<j[mid]:
				return binary_s(l,mid-1,val,j)
			else:
				return binary_s(mid+1,r,val,j)
		else:
			return -1
	except:
		return -1 

def dictionary(request):
	global names
	val=request.GET.get("val")
	for i in names:
		dist=editDistance(val,i,len(val),len(i))
		if(dist<(len(val)//2)):
			return HttpResponse(i)			
	return HttpResponse("")

def editDistance(str1, str2, m, n):
 
    if m == 0:
        return n
    if n == 0:
        return m
    if str1[m-1] == str2[n-1]:
        return editDistance(str1, str2, m-1, n-1) 
    return 1 + min(editDistance(str1, str2, m, n-1),    # Insert
                   editDistance(str1, str2, m-1, n),    # Remove
                   editDistance(str1, str2, m-1, n-1)    # Replace
                   )